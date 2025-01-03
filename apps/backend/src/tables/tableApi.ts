import { ArcTable } from "@architect/functions/types/tables";
import { Table, TableAPI, TableName, TableSchemas } from "./schema";
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
): TableAPI<Table> => {
  return {
    delete: async (key: string) => {
      await lowLevelTable.delete({ pk: key });
    },
    get: async (key: string) =>
      schema.parse(await lowLevelTable.get({ pk: key })),
    update: async (
      item: { pk: TTableRecord["pk"] } & Partial<TTableRecord>
    ) => {
      const previous = (await lowLevelTable.get({ pk: item.pk })) as
        | TTableRecord
        | undefined;
      if (!previous) {
        throw notFound(
          `Error updating table ${tableName}: Item with pk ${item.pk} not found`
        );
      }

      await lowLevelTable.update({
        Key: { pk: item.pk },
        AttributeUpdates: { version: previous.version + 1, ...item },
        ConditionExpression: "#version = :version",
        ExpressionAttributeValues: {
          ":version": previous.version,
        },
        ExpressionAttributeNames: { "#version": "version" },
      });
    },
    create: async (item: Omit<TTableRecord, "version">) => {
      await lowLevelTable.update({
        Key: { pk: item.pk },
        AttributeUpdates: schema.parse({ version: 1, ...item }),
        ConditionExpression: "attribute_not_exists(pk)",
      });
    },
  };
};
