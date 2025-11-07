import { z } from "zod";

import {
  SchedulePositionTemplate,
  schedulePositionTemplatesSchema,
} from "./schedulePositionTemplates";

const scheduleDayTemplatesSchema = z.record(z.string(), schedulePositionTemplatesSchema);

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

export type ScheduleDayTemplate = Array<SchedulePositionTemplate>;
