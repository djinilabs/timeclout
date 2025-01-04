import { ArcTable } from "@architect/functions/types/tables";
import { TableAPI, TableName, TableSchemas } from "./schema";
import { z } from "zod";
import { notFound } from "@hapi/boom";

export const tableApi = <
  TTableName extends TableName,
  TTableSchema extends TableSchemas[TTableName] = TableSchemas[TTableName],
  TTableRecord extends z.infer<TTableSchema> = z.infer<TTableSchema>
>(
  tableName: TTableName,
  lowLevelTable: ArcTable<{ pk: string }>,
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
    update: async (
      item: { pk: TTableRecord["pk"] } & Partial<TTableRecord>
    ) => {
      const previous = (await self.get(item.pk)) as TTableRecord | undefined;
      if (!previous) {
        throw notFound(
          `Error updating table ${tableName}: Item with pk ${item.pk} not found`
        );
      }

      const newAttributeValues = { version: previous.version + 1, ...item };

      await lowLevelTable.update({
        Key: { pk: item.pk },
        AttributeUpdates: newAttributeValues,
        ConditionExpression: "#version = :version",
        ExpressionAttributeValues: {
          ":version": previous.version,
        },
        ExpressionAttributeNames: { "#version": "version" },
      });
      return schema.parse({ ...previous, ...newAttributeValues });
    },
    create: async (item: Omit<TTableRecord, "version">) => {
      const parsedItem = schema.parse({
        version: 1,
        createdAt: new Date().toISOString(),
        createdBy: item.pk,
        ...item,
      });
      console.log("parsedItem", parsedItem);
      await lowLevelTable.update({
        Key: { pk: item.pk },
        AttributeUpdates: parsedItem,
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
