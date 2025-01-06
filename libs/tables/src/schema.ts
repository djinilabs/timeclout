import { z, ZodSchema } from "zod";

const TableBaseSchema = z.object({
  pk: z.string(),
  version: z.number(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});

export const tableSchemas = {
  entity: TableBaseSchema.extend({
    name: z.string(),
    email: z.string().email().optional(),
  }),
  permission: TableBaseSchema.extend({
    sk: z.string(),
    resourceType: z.string(),
    parentPk: z.string().optional(),
    type: z.number().int().min(1),
  }),
} as const;

export type Permission = z.infer<typeof tableSchemas.permission>;

export const PERMISSION_LEVELS = {
  READ: 1,
  WRITE: 2,
  OWNER: 3,
};

export type ResourceType = "companies" | "units" | "users" | "teams";

export const resourceRef = (resourceType: ResourceType, id: string) =>
  `${resourceType}/${id}`;

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
  delete: (key: string, sk?: string) => Promise<TTableRecord>;
  deleteAll: (key: string) => Promise<void>;
  get: (pk: string, sk?: string) => Promise<TTableRecord | undefined>;
  batchGet: (keys: string[]) => Promise<TTableRecord[]>;
  update: (item: Partial<TTableRecord>) => Promise<TTableRecord>;
  create: (item: TTableRecord) => Promise<TTableRecord>;
  query: (query: Query) => Promise<TTableRecord[]>;
};

export type DatabaseSchema = {
  entity: TableAPI<"entity">;
  permission: TableAPI<"permission">;
};
