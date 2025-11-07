import { z } from "zod";

const workDaySchema = z.object({
  isWorkDay: z.boolean(),
  start: z.string().optional(),
  end: z.string().optional(),
});

export const worksScheduleSchema = z.object({
  monday: workDaySchema,
  tuesday: workDaySchema,
  wednesday: workDaySchema,
  thursday: workDaySchema,
  friday: workDaySchema,
  saturday: workDaySchema,
  sunday: workDaySchema,
});

export const worksScheduleParser = {
  parse: (item: unknown) => {
    return worksScheduleSchema.parse(item);
  },
};

export type WorkSchedule = z.infer<typeof worksScheduleSchema>;
