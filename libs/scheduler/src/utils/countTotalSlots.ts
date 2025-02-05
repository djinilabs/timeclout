import { ShiftSchedule } from "../types";

export const countTotalSlots = (schedule: ShiftSchedule): number =>
  schedule.shifts.reduce(
    (slotCount, shift) =>
      slotCount + shift.assigned.reduce((acc) => acc + 1, 0),
    0
  );
