import { z } from "zod";
import { colorNames } from "./colors";
const scheduleDayTemplatesSchema = z.record(
  z.array(
    z.object({
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
    })
  )
);

export const scheduleDayTemplatesParser = {
  parse: (item: unknown) => {
    try {
      return scheduleDayTemplatesSchema.parse(item);
    } catch (err) {
      throw new Error(`Error parsing schedule day templates: ${err.message}`);
    }
  },
};

export type ScheduleDayTemplates = z.infer<typeof scheduleDayTemplatesSchema>;

export type ScheduleDayTemplate = ScheduleDayTemplates[string];
