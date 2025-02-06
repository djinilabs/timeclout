import { ShiftSchedule, SlotWorker } from "../types";

export const getUniqueWorkers = (schedule: ShiftSchedule): Set<SlotWorker> =>
  schedule.shifts.reduce((workers, shift) => {
    workers.add(shift.assigned);
    return workers;
  }, new Set<SlotWorker>());
