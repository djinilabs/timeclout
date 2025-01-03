import { z } from "zod";

const TableBaseSchema = z.object({
  version: z.number(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});

type TableBase = z.infer<typeof TableBaseSchema>;

export const tableSchemas = {
  entity: TableBaseSchema.extend({
    pk: z.string(),
  }),
  permission: TableBaseSchema.extend({
    pk: z.string(),
    entityId: z.string(),
  }),
};

export type TableSchemas = typeof tableSchemas;
export type TableName = keyof TableSchemas;
export type TableSchema = (typeof tableSchemas)[TableName];

export type Table = TableBase & z.infer<TableSchema>;

export type TableAPI<T extends Table> = {
  delete: (key: string) => Promise<void>;
  get: (key: string) => Promise<T | undefined>;
  update: (item: Partial<T>) => Promise<void>;
  create: (item: T) => Promise<void>;
};

export type DatabaseSchema = {
  [K in TableName]: TableAPI<z.infer<(typeof tableSchemas)[K]>>;
};
