import { ShiftSchedule } from "../types";
import { countTotalMinutesInSlot } from "./countTotalMinutesInSlot";

export const countTotalMinutesInSchedule = (schedule: ShiftSchedule): number =>
  schedule.shifts.reduce(
    (slotCount, shift) => slotCount + countTotalMinutesInSlot(shift.slot),
    0
  );
