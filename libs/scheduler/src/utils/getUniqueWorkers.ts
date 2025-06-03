import { ShiftSchedule, SlotWorker } from "../types";

export const getUniqueWorkers = (schedule: ShiftSchedule): Set<SlotWorker> => {
  const workerMap = new Map<string, SlotWorker>();
  for (const shift of schedule.shifts) {
    workerMap.set(shift.assigned.pk, shift.assigned);
  }
  return new Set(workerMap.values());
};
