import { z, ZodSchema } from "zod";

const TableBaseSchema = z.object({
  pk: z.string(),
  version: z.number(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});

export const tableSchemas: Record<TableName, ZodSchema> = {
  entity: TableBaseSchema.extend({
    name: z.string(),
    email: z.string().email().optional(),
  }),
  permission: TableBaseSchema.extend({
    resourceType: z.string(),
    entityId: z.string(),
  }),
};

export type TableSchemas = typeof tableSchemas;
export type TableName = "entity" | "permission";

export type Query = {
  IndexName?: string;
  KeyConditionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeValues?: Record<string, any>;
  ExpressionAttributeNames?: Record<string, string>;
};

export type TableAPI<
  TTableName extends TableName,
  TTableRecord extends z.infer<TableSchemas[TTableName]> = z.infer<
    TableSchemas[TTableName]
  >
> = {
  delete: (key: string) => Promise<TTableRecord>;
  get: (key: string) => Promise<TTableRecord | undefined>;
  batchGet: (keys: string[]) => Promise<TTableRecord[]>;
  update: (item: Partial<TTableRecord>) => Promise<TTableRecord>;
  create: (item: TTableRecord) => Promise<TTableRecord>;
  query: (query: Query) => Promise<TTableRecord[]>;
};

export type DatabaseSchema = {
  entity: TableAPI<"entity">;
  permission: TableAPI<"permission">;
};
