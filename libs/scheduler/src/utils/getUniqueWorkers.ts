import { ShiftSchedule, SlotWorker } from "../types";

export const getUniqueWorkers = (schedule: ShiftSchedule): Set<SlotWorker> =>
  schedule.shifts.reduce((workers, shift) => {
    for (const worker of shift.assigned) {
      workers.add(worker);
    }
    return workers;
  }, new Set<SlotWorker>());
