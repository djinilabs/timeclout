import { z } from "zod";

import {
  SchedulePositionTemplate,
  schedulePositionTemplatesSchema,
} from "./schedulePositionTemplates";

const scheduleDayTemplatesSchema = z.record(schedulePositionTemplatesSchema);

export const scheduleDayTemplatesParser = {
  parse: (item: unknown) => {
    try {
      return scheduleDayTemplatesSchema.parse(item);
    } catch (error) {
      throw new Error(`Error parsing schedule day templates: ${error.message}`);
    }
  },
};

export type ScheduleDayTemplates = z.infer<typeof scheduleDayTemplatesSchema>;

export type ScheduleDayTemplate = Array<SchedulePositionTemplate>;
