import { z } from "zod";
import { parseSlot, SlotSchema } from "./slot";
import { Slot as SlotsType } from "../types";
import { ScheduleTypes } from "./scheduleTypes";

export const SlotsSchema = z.array(SlotSchema);

export type Slots = z.infer<typeof SlotsSchema>;

export const parseSlots =
  (scheduleTypes: ScheduleTypes) =>
  (slots: unknown): SlotsType[] => {
    if (!Array.isArray(slots)) {
      throw new Error("Slots must be an array");
    }
    const slotParser = parseSlot(scheduleTypes);
    return slots.map((slot) => slotParser(slot));
  };
