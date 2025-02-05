import { z } from "zod";
import { Slot } from "../types";
import { ScheduleTypes } from "./scheduleTypes";
import { getDefined } from "../utils/getDefined";

export const WorkHourSchema = z.object({
  start: z.number().int(),
  end: z.number().int(),
  inconvenienceMultiplier: z.number().int(),
});

export const SlotSchema = z.array(z.string());

export const parseSlot =
  (scheduleTypes: ScheduleTypes) =>
  (unparsedSlot: unknown): Slot => {
    const slot = SlotSchema.parse(unparsedSlot);
    return {
      members: slot.map((member) => ({
        workHours: getDefined(
          scheduleTypes[member],
          `Schedule type ${member} not found`
        ).workHours,
        startsOnStandardWorkDay: getDefined(
          scheduleTypes[member],
          `Schedule type ${member} not found`
        ).startsOnStandardWorkDay,
      })),
    };
  };
