import { tables } from "@architect/functions";
import once from "ramda/src/once";
import { DatabaseSchema, TableAPI, TableName, tableSchemas } from "./schema";
import { tableApi } from "./tableApi";
import { z } from "zod";

export const database = once(async (): Promise<Promise<DatabaseSchema>> => {
  const client = await tables();
  const existingTables = Array.from(
    Object.keys(await client.reflect())
  ) as Array<TableName>;
  return Object.fromEntries(
    existingTables.map((tableName) => {
      const lowLevelTable = client[tableName];
      const schema = tableSchemas[tableName as keyof typeof tableSchemas];
      return [
        tableName,
        tableApi<typeof tableName>(tableName, lowLevelTable, schema),
      ] as [
        typeof tableName,
        TableAPI<z.infer<(typeof tableSchemas)[typeof tableName]>>
      ];
    })
  ) as DatabaseSchema;
});
