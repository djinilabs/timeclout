import { ArcTable } from "@architect/functions/types/tables";
import { TableAPI, TableName, TableSchemas } from "./schema";
import { z, ZodSchema } from "zod";
import { conflict, notFound } from "@hapi/boom";
import { AwsLiteDynamoDB } from "@aws-lite/dynamodb-types";
import { getDefined } from "@/utils";
import { logger } from "./logger";
// removes undefined values from the item
const cleanItem = <T extends object>(item: T): T => {
  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => value !== undefined)
  ) as T;
};

const parsingItem =
  <T extends object>(schema: ZodSchema, tableName: string) =>
  (item: unknown, operation: string): T => {
    try {
      return cleanItem(schema.parse(item));
    } catch (err) {
      err.message = `Error parsing item when ${operation} in ${tableName}: ${err.message}`;
      throw err;
    }
  };

export const tableApi = <
  TTableName extends TableName,
  TTableSchema extends TableSchemas[TTableName] = TableSchemas[TTableName],
  TTableRecord extends z.infer<TTableSchema> = z.infer<TTableSchema>,
>(
  tableName: TTableName,
  lowLevelTable: ArcTable<{ pk: string; sk?: string }>,
  lowLevelClient: AwsLiteDynamoDB,
  lowLevelTableName: string,
  schema: TTableSchema
): TableAPI<TTableName> => {
  const console = logger(tableName);
  const parseItem = parsingItem(schema, tableName);
  const self: TableAPI<TTableName> = {
    delete: async (pk: string, sk?: string) => {
      try {
        const item = await self.get(pk, sk);
        if (!item) {
          console.warn("item not found", pk, sk);
          throw notFound(
            `Error deleting record in table ${tableName}: Item not found`
          );
        }
        await lowLevelTable.delete(sk ? { pk, sk } : { pk });
        return item;
      } catch (err) {
        console.error("Error deleting item", tableName, pk, sk, err);
        throw err;
      }
    },
    deleteAll: async (pk: string) => {
      try {
        const items = (
          await lowLevelTable.query({
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: { ":pk": pk },
          })
        ).Items;

        await Promise.all(items.map((item) => lowLevelTable.delete(item)));
      } catch (err) {
        console.error("Error deleting all items", tableName, pk, err);
        throw err;
      }
    },
    deleteIfExists: async (pk: string, sk?: string) => {
      try {
        const item = await self.get(pk, sk);
        if (!item) {
          return undefined;
        }
        await lowLevelTable.delete(sk ? { pk, sk } : { pk });
        return item;
      } catch (err) {
        console.error("Error deleting item", tableName, pk, sk, err);
        throw err;
      }
    },
    get: async (pk: string, sk?: string) => {
      try {
        if (!pk) {
          throw new Error("pk is required");
        }
        const args = sk ? { pk, sk } : { pk };
        console.info("get from table", tableName, args);
        return schema.optional().parse(await lowLevelTable.get(args));
      } catch (err) {
        console.error("Error getting item", tableName, pk, sk, err);
        throw err;
      }
    },
    batchGet: async (keys: string[]) => {
      if (keys.length === 0) {
        return [];
      }
      try {
        const items = getDefined(
          (
            await lowLevelClient.BatchGetItem({
              RequestItems: {
                [lowLevelTableName]: { Keys: keys.map((key) => ({ pk: key })) },
              },
            })
          ).Responses
        )[lowLevelTableName];
        return items.map((item) =>
          parseItem(item, "batchGet")
        ) as TTableRecord[];
      } catch (err) {
        console.error("Error batch getting items", tableName, keys, err);
        throw err;
      }
    },
    update: async (
      item: { pk: TTableRecord["pk"] } & Partial<TTableRecord>
    ) => {
      try {
        const previousItem = (await self.get(item.pk, item.sk)) as
          | TTableRecord
          | undefined;
        if (!previousItem) {
          throw notFound(
            `Error updating table ${tableName}: Item with pk ${item.pk} not found`
          );
        }

        const newItem = {
          ...previousItem,
          version: previousItem.version + 1,
          updatedAt: new Date().toISOString(),
          ...item,
        };

        await lowLevelClient.PutItem({
          Item: parseItem(newItem, "update"),
          TableName: lowLevelTableName,
          ConditionExpression: "#version = :version",
          ExpressionAttributeValues: {
            ":version": previousItem.version,
          },
          ExpressionAttributeNames: { "#version": "version" },
        });
        return newItem;
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("conditional request failed")
        ) {
          throw conflict("Item was outdated");
        }
        throw err;
      }
    },
    create: async (item: Omit<TTableRecord, "version" | "createdAt">) => {
      console.info("creating new record in ", tableName, item);
      try {
        const parsedItem = parseItem(
          {
            version: 1,
            createdAt: new Date().toISOString(),
            ...item,
          },
          "create"
        );

        await lowLevelClient.PutItem({
          Item: parsedItem,
          TableName: lowLevelTableName,
          ConditionExpression: "attribute_not_exists(pk)",
        });
        return parsedItem as TTableRecord;
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("conditional request failed")
        ) {
          throw conflict("Item already exists");
        }
        throw err;
      }
    },
    upsert: async (item: TTableRecord) => {
      console.info("upsert", item);
      try {
        const existingItem = await self.get(item.pk, item.sk);
        if (existingItem) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt, createdBy, ...rest } = item;
          return self.update(
            parseItem(
              {
                ...existingItem,
                ...rest,
              },
              "upsert"
            )
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, updatedBy, version, ...rest } = item;
        return self.create(rest as TTableRecord);
      } catch (err) {
        console.error("Error upserting item", tableName, item, err);
        throw err;
      }
    },
    query: async (query) => {
      try {
        let items: TTableRecord[] = [];
        let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;

        do {
          const response = (await lowLevelTable.query({
            ...query,
            ExclusiveStartKey: lastEvaluatedKey,
          })) as unknown as {
            Items: TTableRecord[];
            LastEvaluatedKey: Record<string, unknown>;
          };

          items = items.concat(response.Items);
          lastEvaluatedKey = response.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        return items.map((item) => parseItem(item, "query")) as TTableRecord[];
      } catch (err) {
        console.error("Error querying table", tableName, query, err);
        err.message = `Error querying table ${tableName}: ${err.message}`;
        throw err;
      }
    },
  };
  return self;
};
