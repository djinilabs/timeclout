import { z } from "zod";
import { colorNames } from "./colors";

export const schedulePositionTemplateSchema = z.object({
  name: z.string(),
  color: z.enum(colorNames).optional(),
  requiredSkills: z.array(z.string()),
  schedules: z.array(
    z.object({
      startHourMinutes: z.array(z.number()),
      endHourMinutes: z.array(z.number()),
      inconveniencePerHour: z.number(),
    })
  ),
});

export const schedulePositionTemplatesSchema = z.array(
  schedulePositionTemplateSchema
);

export const schedulePositionTemplatesParser = {
  parse: (item: unknown) => {
    try {
      return schedulePositionTemplatesSchema.parse(item);
    } catch (err) {
      throw new Error(
        `Error parsing schedule position templates: ${err.message}`
      );
    }
  },
};

export type SchedulePositionTemplates = z.infer<
  typeof schedulePositionTemplatesSchema
>;

export type SchedulePositionTemplate = z.infer<
  typeof schedulePositionTemplateSchema
>;
