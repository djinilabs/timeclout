import { ShiftSchedule, SlotWorker } from "../types";

export const getUniqueWorkers = (schedule: ShiftSchedule): Set<SlotWorker> =>
  new Set(schedule.shifts.map((shift) => shift.assigned));
