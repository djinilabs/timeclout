import { ShiftScheduleHeuristic, SlotWorker } from "../types";
import { countTotalSlots } from "../utils/countTotalSlots";
import { countTotalUniqueWorkers } from "../utils/countTotalUniqueWorkers";
import { stdDev } from "../utils/standardDeviation";

export const workerSlotProximityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Proximity",
  eval: (schedule) => {
    const totalSlots = countTotalSlots(schedule);
    const totalUniqueWorkers = countTotalUniqueWorkers(schedule);
    const averageSlotsPerShift = totalSlots / schedule.shifts.length;
    const expectedWorkerScheduledShiftProximity =
      totalSlots / totalUniqueWorkers / averageSlotsPerShift;

    const workerPreviousScheduledSlot: Map<SlotWorker, number | undefined> =
      new Map();

    const proximities = schedule.shifts.flatMap((shift, slot) => {
      return shift.assigned.flatMap((worker) => {
        const previousSlot = workerPreviousScheduledSlot.get(worker);
        workerPreviousScheduledSlot.set(worker, slot);
        const distance = slot - (previousSlot ?? 0);
        return [distance / expectedWorkerScheduledShiftProximity];
      });
    });
    return stdDev(1, proximities);
  },
};
