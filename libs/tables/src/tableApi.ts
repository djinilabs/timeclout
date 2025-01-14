import { ArcTable } from "@architect/functions/types/tables";
import { TableAPI, TableName, TableSchemas } from "./schema";
import { z, ZodSchema } from "zod";
import { conflict, notFound } from "@hapi/boom";
import { AwsLiteDynamoDB } from "@aws-lite/dynamodb-types";
import { getDefined } from "@/utils";

// removes undefined values from the item
const cleanItem = <T extends object>(item: T): T => {
  return Object.fromEntries(
    Object.entries(item).filter(([_, value]) => value !== undefined)
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
  const parseItem = parsingItem(schema, tableName);
  const self: TableAPI<TTableName> = {
    delete: async (pk: string, sk?: string) => {
      const item = await self.get(pk, sk);
      if (!item) {
        console.warn("item not found", pk, sk);
        throw notFound(
          `Error deleting record in table ${tableName}: Item not found`
        );
      }
      await lowLevelTable.delete(sk ? { pk, sk } : { pk });
      return item;
    },
    deleteAll: async (pk: string) => {
      const items = (
        await lowLevelTable.query({
          KeyConditionExpression: "pk = :pk",
          ExpressionAttributeValues: { ":pk": pk },
        })
      ).Items;

      await Promise.all(items.map((item) => lowLevelTable.delete(item)));
    },
    get: async (pk: string, sk?: string) => {
      const args = sk ? { pk, sk } : { pk };
      return schema.optional().parse(await lowLevelTable.get(args));
    },
    batchGet: async (keys: string[]) => {
      if (keys.length === 0) {
        return [];
      }
      const items = getDefined(
        (
          await lowLevelClient.BatchGetItem({
            RequestItems: {
              [lowLevelTableName]: { Keys: keys.map((key) => ({ pk: key })) },
            },
          })
        ).Responses
      )[lowLevelTableName];
      return items.map((item) => parseItem(item, "batchGet")) as TTableRecord[];
    },
    update: async (
      item: { pk: TTableRecord["pk"] } & Partial<TTableRecord>
    ) => {
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

      try {
        await lowLevelClient.PutItem({
          Item: parseItem(newItem, "update"),
          TableName: lowLevelTableName,
          ConditionExpression: "#version = :version",
          ExpressionAttributeValues: {
            ":version": previousItem.version,
          },
          ExpressionAttributeNames: { "#version": "version" },
        });
      } catch (err: any) {
        if (err.message.toLowerCase().includes("conditional request failed")) {
          throw conflict("Item was outdated");
        }
        throw err;
      }

      return newItem;
    },
    create: async (item: Omit<TTableRecord, "version" | "createdAt">) => {
      const parsedItem = parseItem(
        {
          version: 1,
          createdAt: new Date().toISOString(),
          ...item,
        },
        "create"
      );

      try {
        await lowLevelClient.PutItem({
          Item: parsedItem,
          TableName: lowLevelTableName,
          ConditionExpression: "attribute_not_exists(pk)",
        });
      } catch (err: any) {
        if (err.message.toLowerCase().includes("conditional request failed")) {
          throw conflict("Item already exists");
        }
        throw err;
      }

      return parsedItem as TTableRecord;
    },
    upsert: async (item: TTableRecord) => {
      const existingItem = await self.get(item.pk, item.sk);
      if (existingItem) {
        console.log("existingItem", existingItem);
        const { createdAt, createdBy, ...rest } = item;
        return self.update({
          ...existingItem,
          ...rest,
        });
      }
      console.log("NON existingItem");
      const { updatedAt, updatedBy, version, ...rest } = item;
      return self.create(rest as TTableRecord);
    },
    query: async (query) => {
      return (await lowLevelTable.query(query)).Items as TTableRecord[];
    },
  };
  return self;
};
