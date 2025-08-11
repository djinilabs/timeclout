import {
  getCompoundedResourceRef,
  getResourceRef,
  gettingResourceRef,
} from "@/utils";
import { z } from "zod";

const TableBaseSchema = z.object({
  pk: z.string(),
  sk: z.string().optional(),
  version: z.number(),
  createdAt: z.string().datetime(),
  createdBy: z.string().refine(getResourceRef),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().refine(getResourceRef).optional(),
  noMainVersion: z.boolean().optional(),
  userVersion: z.string().optional(),
  userVersions: z
    .record(
      z.string(),
      z.object({
        deleted: z.boolean().optional(),
        createdAt: z.string().datetime().optional(),
        createdBy: z.string().refine(getResourceRef).optional(),
        updatedAt: z.string().datetime().optional(),
        updatedBy: z.string().refine(getResourceRef).optional(),
        newProps: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .optional(),
});

const shiftPositionScheduleSchema = z.object({
  startHourMinutes: z.array(z.number().int().min(0)),
  endHourMinutes: z.array(z.number().int().min(0)),
  inconveniencePerHour: z.number().min(0),
});

export const tableSchemas = {
  entity: TableBaseSchema.extend({
    // pk is entity pk
    pk: z.string().refine(getResourceRef),
    name: z.string(),
    parentPk: z.string().refine(getResourceRef).optional(),
    email: z.string().email().optional(),
  }),
  entity_settings: TableBaseSchema.extend({
    // pk is entity pk
    pk: z.string().refine(getResourceRef),
    sk: z.string(), // settings name
    settings: z.any(),
  }),
  permission: TableBaseSchema.extend({
    // pk is entity pk
    pk: z.string().refine(getResourceRef),
    sk: z.string(), // user pk
    resourceType: z.string(),
    parentPk: z.string().refine(getResourceRef).optional(),
    type: z.number().int().min(1),
  }),
  invitation: TableBaseSchema.extend({
    // pk is invitation entity pk
    pk: z.string().refine(getResourceRef),
    sk: z.string().email(), // invitee email
    permissionType: z.number().int().min(1),
    secret: z.string(),
  }),
  leave_request: TableBaseSchema.extend({
    // pk is companies/:companyId/users/:userId
    pk: z.string().refine(getCompoundedResourceRef("companies", "users")),
    sk: z.string(), // leave request startdate/enddate/type
    startDate: z.string().date(),
    endDate: z.string().date(),
    companyPk: z.string().refine(gettingResourceRef("companies")).optional(),
    userPk: z.string().refine(gettingResourceRef("users")).optional(),
    type: z.string(),
    reason: z.string().optional(),
    approved: z.boolean().optional(),
    approvedBy: z.array(z.string()).optional(),
    approvedAt: z.array(z.string().datetime()).optional(),
  }),
  leave: TableBaseSchema.extend({
    // pk is companies/:companyId/users/:userId
    sk: z.string().date(), // leave date
    leaveRequestPk: z.string(),
    leaveRequestSk: z.string(),
    type: z.string(),
  }),
  shift_positions: TableBaseSchema.extend({
    // pk is teams/:teamId
    pk: z.string().refine(gettingResourceRef("teams")),
    sk: z.string(), // daydate/nanoid
    teamPk: z.string().refine(gettingResourceRef("teams")),
    day: z.string().date(),
    name: z.string().optional(),
    color: z.string().optional(),
    requiredSkills: z.array(z.string()),
    schedules: z.array(shiftPositionScheduleSchema),
    assignedTo: z.string().refine(getResourceRef).optional(),
  }),
  "next-auth": TableBaseSchema.extend({
    pk: z.string(),
    sk: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    emailVerified: z.string().datetime().optional(),
    image: z.string().optional(),
    id: z.string(),
  }),
} as const;

export type EntityRecord = z.infer<typeof tableSchemas.entity>;
export type PermissionRecord = z.infer<typeof tableSchemas.permission>;
export type LeaveRequestRecord = z.infer<typeof tableSchemas.leave_request>;
export type LeaveRecord = z.infer<typeof tableSchemas.leave>;
export type InvitationRecord = z.infer<typeof tableSchemas.invitation>;
export type ShiftPositionsRecord = z.infer<typeof tableSchemas.shift_positions>;
export type ShiftPositionsSchedule = z.infer<
  typeof shiftPositionScheduleSchema
>;

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

export type TableBaseSchemaType = z.infer<typeof TableBaseSchema>;
export type TableSchemas = typeof tableSchemas;
export type TableName =
  | "entity"
  | "permission"
  | "invitation"
  | "entity_settings"
  | "leave_request"
  | "leave"
  | "shift_positions"
  | "next-auth";

export type Query = {
  IndexName?: string;
  KeyConditionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeValues?: Record<string, unknown>;
  ExpressionAttributeNames?: Record<string, string>;
  ScanIndexForward?: boolean;
};

export type QueryResponse<TTableRecord extends TableBaseSchemaType> = {
  items: TTableRecord[];
  areAnyUnpublished: boolean;
};

export type TableAPI<
  TTableName extends TableName,
  TTableRecord extends z.infer<TableSchemas[TTableName]> = z.infer<
    TableSchemas[TTableName]
  >
> = {
  delete: (
    key: string,
    sk?: string,
    version?: string | null
  ) => Promise<TTableRecord>;
  deleteIfExists: (
    key: string,
    sk?: string,
    version?: string | null
  ) => Promise<TTableRecord | undefined>;
  deleteAll: (key: string, version?: string | null) => Promise<void>;
  get: (
    pk: string,
    sk?: string,
    version?: string | null
  ) => Promise<TTableRecord | undefined>;
  batchGet: (
    keys: string[],
    version?: string | null
  ) => Promise<TTableRecord[]>;
  update: (
    item: Partial<TTableRecord>,
    version?: string | null
  ) => Promise<TTableRecord>;
  upsert: (
    item: Omit<TTableRecord, "version">,
    version?: string | null
  ) => Promise<TTableRecord>;
  create: (
    item: Omit<TTableRecord, "version" | "createdAt">,
    version?: string | null
  ) => Promise<TTableRecord>;
  query: (
    query: Query,
    version?: string | null
  ) => Promise<QueryResponse<TTableRecord>>;
  merge: (
    pk: string,
    sk: string,
    version: string | null
  ) => Promise<TTableRecord>;
  revert: (
    pk: string,
    sk: string | undefined,
    version: string
  ) => Promise<TTableRecord>;
};

export type DatabaseSchema = {
  entity: TableAPI<"entity">;
  permission: TableAPI<"permission">;
  invitation: TableAPI<"invitation">;
  entity_settings: TableAPI<"entity_settings">;
  leave_request: TableAPI<"leave_request">;
  leave: TableAPI<"leave">;
  shift_positions: TableAPI<"shift_positions">;
  "next-auth": TableAPI<"next-auth">;
};
