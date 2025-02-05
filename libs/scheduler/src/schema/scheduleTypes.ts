import { z } from "zod";
import { WorkHourSchema } from "./slot";

export const ScheduleTypeSchema = z.object({
  workHours: z.array(WorkHourSchema),
  startsOnStandardWorkDay: z.boolean(),
});

export const ScheduleTypesSchema = z.record(z.string(), ScheduleTypeSchema);

export type ScheduleTypes = z.infer<typeof ScheduleTypesSchema>;

export const parseScheduleTypes = (scheduleTypes: unknown): ScheduleTypes =>
  ScheduleTypesSchema.parse(scheduleTypes);
