import { ShiftScheduleHeuristic, SlotWorker } from "../types";
import { countTotalSlots } from "../utils/countTotalSlots";
import { countTotalUniqueWorkers } from "../utils/countTotalUniqueWorkers";
import { stdDev } from "../utils/standardDeviation";

export const workerSlotEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Equality",
  eval: (schedule) => {
    const totalSlotCount = countTotalSlots(schedule);
    const totalUniqueWorkerCount = countTotalUniqueWorkers(schedule);
    const expectedSlotsPerWorker = totalSlotCount / totalUniqueWorkerCount;

    const workerSlots: Map<SlotWorker, number> = new Map();

    for (const shift of schedule.shifts) {
      let index = 0;
      for (const worker of shift.assigned) {
        const currentSlotCount = workerSlots.get(worker) ?? 0;
        workerSlots.set(worker, currentSlotCount + 1);
        index++;
      }
    }

    for (const [worker, workerSlotCount] of workerSlots.entries()) {
      const workerUnavailabilityRatio =
        (schedule.shifts.length -
          worker.unavailableForWorkReasonsShiftCount()) /
        schedule.shifts.length;
      workerSlots.set(
        worker,
        workerSlotCount / workerUnavailabilityRatio / expectedSlotsPerWorker
      );
    }

    const slotCount = Array.from(workerSlots.values());

    return stdDev(1, slotCount);
  },
};
