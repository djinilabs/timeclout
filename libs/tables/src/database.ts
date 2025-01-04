import { tables } from "@architect/functions";
import { z } from "zod";
import { once } from "@/utils";
import { DatabaseSchema, TableAPI, TableName, tableSchemas } from "./schema";
import { tableApi } from "./tableApi";

export const database = once(async (): Promise<DatabaseSchema> => {
  const client = await tables();
  const existingTables = Array.from(
    Object.entries(await client.reflect())
  ) as Array<[TableName, string]>;
  const lowLevelClient = client._client;
  return Object.fromEntries(
    existingTables.map(([tableName, lowLevelTableName]) => {
      const lowLevelTable = client[tableName];
      const schema = tableSchemas[tableName as keyof typeof tableSchemas];
      return [
        tableName,
        tableApi<typeof tableName>(
          tableName,
          lowLevelTable,
          lowLevelClient,
          lowLevelTableName,
          schema
        ),
      ] as [typeof tableName, TableAPI<typeof tableName>];
    })
  ) as DatabaseSchema;
});
