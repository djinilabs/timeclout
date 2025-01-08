import { z, ZodSchema } from "zod";

const TableBaseSchema = z.object({
  pk: z.string(),
  sk: z.string().optional(),
  version: z.number(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});

export const tableSchemas = {
  entity: TableBaseSchema.extend({
    // pk is entity pk
    name: z.string(),
    parentPk: z.string().optional(),
    email: z.string().email().optional(),
  }),
  entity_settings: TableBaseSchema.extend({
    // pk is entity pk
    sk: z.string(), // settings name
    settings: z.any(),
  }),
  permission: TableBaseSchema.extend({
    // pk is entity pk
    sk: z.string(), // user pk
    resourceType: z.string(),
    parentPk: z.string().optional(),
    type: z.number().int().min(1),
  }),
  invitation: TableBaseSchema.extend({
    // pk is invitation entity pk
    sk: z.string(), // invitee pk
    permissionType: z.number().int().min(1),
    secret: z.string(),
  }),
} as const;

export type Permission = z.infer<typeof tableSchemas.permission>;

export const PERMISSION_LEVELS = {
  READ: 1,
  WRITE: 2,
  OWNER: 3,
};

export const permissionLevelToName = (level: number) => {
  switch (level) {
    case PERMISSION_LEVELS.READ:
      return "Member";
    case PERMISSION_LEVELS.WRITE:
      return "Administrator";
    case PERMISSION_LEVELS.OWNER:
      return "Owner";
  }
};

export type ResourceType = "companies" | "units" | "users" | "teams";

export const resourceRef = (resourceType: ResourceType, id: string) =>
  `${resourceType}/${id}`;

export type TableSchemas = typeof tableSchemas;
export type TableName =
  | "entity"
  | "permission"
  | "invitation"
  | "entity_settings";

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
  >,
> = {
  delete: (key: string, sk?: string) => Promise<TTableRecord>;
  deleteAll: (key: string) => Promise<void>;
  get: (pk: string, sk?: string) => Promise<TTableRecord | undefined>;
  batchGet: (keys: string[]) => Promise<TTableRecord[]>;
  update: (item: Partial<TTableRecord>) => Promise<TTableRecord>;
  upsert: (item: TTableRecord) => Promise<TTableRecord>;
  create: (item: TTableRecord) => Promise<TTableRecord>;
  query: (query: Query) => Promise<TTableRecord[]>;
};

export type DatabaseSchema = {
  entity: TableAPI<"entity">;
  permission: TableAPI<"permission">;
  invitation: TableAPI<"invitation">;
  entity_settings: TableAPI<"entity_settings">;
};
