import { ArcTable } from "@architect/functions/types/tables";
import {
  TableAPI,
  TableName,
  TableSchemas,
  TableBaseSchemaType,
} from "./schema";
import { z, ZodSchema } from "zod";
import { conflict, notFound } from "@hapi/boom";
import { AwsLiteDynamoDB } from "@aws-lite/dynamodb-types";
import { getDefined } from "@/utils";
import omit from "lodash.omit";
import { logger } from "./logger";

// removes undefined values from the item
const clean = <T extends object>(item: T): T => {
  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => value !== undefined)
  ) as T;
};

const parsingItem =
  <T extends TableBaseSchemaType>(schema: ZodSchema, tableName: string) =>
  (item: unknown, operation: string): T => {
    try {
      return clean(schema.parse(item));
    } catch (err) {
      err.message = `Error parsing item when ${operation} in ${tableName}: ${err.message}`;
      throw err;
    }
  };

const getVersion = <T extends TableBaseSchemaType>(
  item: T | undefined,
  version?: string | null
): T | undefined => {
  if (!version || !item) {
    return item;
  }
  if (!version && item.noMainVersion) {
    return undefined;
  }
  const userVersionMeta = item.userVersions?.[version];
  if (userVersionMeta?.deleted) {
    return undefined;
  }
  const userVersionProps = userVersionMeta?.newProps;
  if (!userVersionProps) {
    return item;
  }
  return {
    ...keySubset(item),
    ...userVersionProps,
  } as T;
};

const setVersion = <T extends TableBaseSchemaType>(
  _base: T | undefined,
  newVersion: Partial<T>,
  version: string
): T => {
  const cleanNewVersion = clean(
    omit(newVersion, ["userVersions", "noMainVersion", "version"])
  );
  const base = _base ?? {
    pk: newVersion.pk,
    sk: newVersion.sk,
    noMainVersion: true,
  };
  return {
    ...base,
    userVersions: {
      ..._base?.userVersions,
      [version]: {
        newProps: cleanNewVersion,
      },
    },
  } as T;
};

const keySubset = <T extends TableBaseSchemaType>(
  item: Partial<T>
): { pk: string; sk: string } | { pk: string; sk?: undefined } => {
  if (!item.pk) {
    throw new Error("pk is required");
  }
  if (item.sk) {
    return { pk: item.pk, sk: item.sk };
  }
  return { pk: item.pk };
};

export const tableApi = <
  TTableName extends TableName,
  TTableSchema extends TableSchemas[TTableName] = TableSchemas[TTableName],
  TTableRecord extends z.infer<TTableSchema> = z.infer<TTableSchema>
>(
  tableName: TTableName,
  lowLevelTable: ArcTable<{ pk: string; sk?: string }>,
  lowLevelClient: AwsLiteDynamoDB,
  lowLevelTableName: string,
  schema: TTableSchema
): TableAPI<TTableName> => {
  const console = logger(tableName);
  const parseItem = parsingItem(schema, tableName) as (
    item: unknown,
    operation: string
  ) => TTableRecord;
  const self: TableAPI<TTableName> = {
    delete: async (pk: string, sk?: string, version?: string) => {
      console.info("delete", { pk, sk, version });
      if (version) {
        const key = keySubset({ pk, sk });
        const item = await self.get(key.pk, key.sk);
        if (!item) {
          throw notFound(
            `Error deleting record in table ${tableName}: Item not found`
          );
        }
        const newVersion = {
          ...item,
          userVersions: {
            ...item.userVersions,
            [version]: { deleted: true },
          },
        };
        return self.update(newVersion);
      }
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
    deleteAll: async (pk: string, version?: string) => {
      console.info("deleteAll", { pk, version });
      try {
        console.debug("deleteAll:Going to get all items", tableName, { pk });
        const items = (
          await lowLevelTable.query({
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: { ":pk": pk },
          })
        ).Items;

        console.debug("deleteAll:Got all items", tableName, { pk }, items);

        await Promise.all(
          items.map((item) => self.delete(item.pk, item.sk, version))
        );
      } catch (err) {
        console.error("Error deleting all items", tableName, pk, err);
        throw err;
      }
    },
    deleteIfExists: async (pk: string, sk?: string, version?: string) => {
      console.info("deleteIfExists", { pk, sk, version });
      try {
        const item = await self.get(pk, sk, version);
        if (!item) {
          return undefined;
        }
        return await self.delete(pk, sk, version);
      } catch (err) {
        console.error("Error deleting item", tableName, pk, sk, err);
        throw err;
      }
    },
    get: async (pk: string, sk?: string, version?: string) => {
      console.info("get", { pk, sk, version });
      try {
        const args = keySubset({ pk, sk });
        const item = schema.optional().parse(await lowLevelTable.get(args));
        return getVersion(item, version);
      } catch (err) {
        console.error("Error getting item", tableName, pk, sk, err);
        throw err;
      }
    },
    batchGet: async (keys: string[], version?: string) => {
      console.info("batchGet", { keys, version });
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
        return items
          .map((item) => getVersion(parseItem(item, "batchGet"), version))
          .filter(Boolean) as TTableRecord[];
      } catch (err) {
        console.error("Error batch getting items", tableName, keys, err);
        throw err;
      }
    },
    update: async (
      item: { pk: TTableRecord["pk"] } & Partial<TTableRecord>,
      version?: string
    ): Promise<TTableRecord> => {
      console.info("update", JSON.stringify({ item, version }, null, 2));
      try {
        const previousItem = (await self.get(item.pk, item.sk)) as
          | TTableRecord
          | undefined;
        if (!previousItem) {
          throw notFound(
            `Error updating table ${tableName}: Item with pk ${item.pk} not found`
          );
        }

        if (version) {
          const newItem = setVersion(previousItem, item, version);
          return self.update(newItem) as Promise<TTableRecord>;
        }

        const newItem = clean(
          parseItem(
            {
              ...previousItem,
              version: previousItem.version + 1,
              updatedAt: new Date().toISOString(),
              ...item,
            },
            "update"
          ) as TTableRecord
        );

        await lowLevelClient.PutItem({
          Item: newItem,
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
    create: async (
      item: Omit<TTableRecord, "version" | "createdAt">,
      version?: string
    ) => {
      console.info("create", JSON.stringify({ item, version }, null, 2));
      try {
        if (version) {
          // first, we need to verify if the record already exists
          const existingItem = await self.get(item.pk, item.sk);
          if (!existingItem) {
            const newItem = clean(
              parseItem(
                {
                  ...item,
                  pk: item.pk,
                  sk: item.sk,
                  noMainVersion: true,
                  version: 1,
                  createdAt: new Date().toISOString(),
                  userVersions: {
                    [version]: {
                      newProps: clean(item),
                    },
                  },
                },
                "create"
              ) as TTableRecord
            );
            return self.create(newItem);
          }
          // if the record exists, we need to update it
          const newItem = clean({
            ...existingItem,
            userVersions: {
              ...existingItem.userVersions,
              [version]: {
                newProps: clean(item),
              },
            },
          });
          return self.update(newItem) as Promise<TTableRecord>;
        }
        const parsedItem = clean(
          parseItem(
            {
              version: 1,
              createdAt: new Date().toISOString(),
              ...item,
            },
            "create"
          )
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
    upsert: async (item: TTableRecord, version?: string) => {
      console.info("upsert", JSON.stringify({ item, version }, null, 2));
      try {
        const existingItem = await self.get(item.pk, item.sk);

        if (version) {
          const newItem = setVersion(existingItem, item, version);
          return self.upsert(newItem);
        }

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

        const rest = omit(item, [
          "updatedAt",
          "updatedBy",
          "version",
        ]) as TTableRecord;
        return self.create(rest, version);
      } catch (err) {
        console.error("Error upserting item", tableName, item, err);
        throw err;
      }
    },
    query: async (query, version) => {
      console.info("query", { query, version });
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

        return items
          .map((item) => getVersion(parseItem(item, "query"), version))
          .filter(Boolean) as TTableRecord[];
      } catch (err) {
        console.error("Error querying table", tableName, query, err);
        err.message = `Error querying table ${tableName}: ${err.message}`;
        throw err;
      }
    },
    merge: async (pk: string, sk: string | undefined, version: string) => {
      console.info("merge", { pk, sk, version });
      const existingItem = await self.get(pk, sk, version);
      if (!existingItem) {
        throw notFound(
          `Error merging item in table ${tableName}: Item not found`
        );
      }
      const versionMeta = existingItem.userVersions?.[version];
      if (!versionMeta) {
        return existingItem;
      }
      if (versionMeta.deleted) {
        // item was removed, so we need to remove the main item
        await lowLevelTable.delete({ pk, sk });
        return existingItem;
      }
      const newItem = clean({
        pk,
        sk,
        ...versionMeta.newProps,
        userVersions: clean({
          ...existingItem.userVersions,
          [version]: undefined,
        }),
      }) as TTableRecord;
      return self.update(newItem);
    },
  };
  return self;
};
