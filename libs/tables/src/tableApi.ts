import { ArcTable } from "@architect/functions/types/tables";
import { TableAPI, TableName, TableSchemas } from "./schema";
import { z } from "zod";
import { notFound } from "@hapi/boom";
import { AwsLiteDynamoDB } from "@aws-lite/dynamodb-types";

export const tableApi = <
  TTableName extends TableName,
  TTableSchema extends TableSchemas[TTableName] = TableSchemas[TTableName],
  TTableRecord extends z.infer<TTableSchema> = z.infer<TTableSchema>
>(
  tableName: TTableName,
  lowLevelTable: ArcTable<{ pk: string }>,
  lowLevelClient: AwsLiteDynamoDB,
  lowLevelTableName: string,
  schema: TTableSchema
): TableAPI<TTableName> => {
  const self: TableAPI<TTableName> = {
    delete: async (key: string) => {
      const item = await self.get(key);
      if (!item) {
        throw notFound(
          `Error deleting table ${tableName}: Item with pk ${key} not found`
        );
      }
      await lowLevelTable.delete({ pk: key });
      return item;
    },
    get: async (key: string) => {
      return schema
        .optional()
        .parse(await await lowLevelTable.get({ pk: key }));
    },
    batchGet: async (keys: string[]) => {
      const items = await lowLevelClient.BatchGetItem({
        RequestItems: {
          [lowLevelTableName]: { Keys: keys.map((key) => ({ pk: key })) },
        },
      });
      return z.array(schema).parse(items.Responses[lowLevelTableName]);
    },
    update: async (
      item: { pk: TTableRecord["pk"] } & Partial<TTableRecord>
    ) => {
      const previousItem = (await self.get(item.pk)) as
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
        ...item,
      };

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
    },
    create: async (item: Omit<TTableRecord, "version">) => {
      const parsedItem = schema.parse({
        version: 1,
        createdAt: new Date().toISOString(),
        createdBy: item.pk,
        ...item,
      });
      console.log("parsedItem", parsedItem);

      await lowLevelClient.PutItem({
        Item: parsedItem,
        TableName: lowLevelTableName,
        ConditionExpression: "attribute_not_exists(pk)",
      });

      return parsedItem;
    },
    query: async (query) => {
      return (await lowLevelTable.query(query)).Items;
    },
  };
  return self;
};
