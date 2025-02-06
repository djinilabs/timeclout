import { ShiftScheduleHeuristic, SlotWorker } from "../types";
import { calculateWorkerUnavailabilityRatio } from "../utils/calculateWorkerUnavailabilityRatio";
import { countTotalMinutesInSlot } from "../utils/countTotalMinutesInSlot";
import { stdDev } from "../utils/standardDeviation";

export const workerSlotEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Equality",
  eval: (schedule) => {
    const workerMinutes: Map<SlotWorker, number> = new Map();

    for (const shift of schedule.shifts) {
      let index = 0;
      const currentSlotCount = workerMinutes.get(shift.assigned) ?? 0;
      workerMinutes.set(
        shift.assigned,
        currentSlotCount + countTotalMinutesInSlot(shift.slot)
      );
      index++;
    }

    const [expectedMinutesPerWorker, workerUnavailabilityRatio] =
      calculateWorkerUnavailabilityRatio(schedule);

    for (const [worker, minutes] of workerMinutes.entries()) {
      const ratio = workerUnavailabilityRatio(worker);
      workerMinutes.set(worker, minutes / ratio / expectedMinutesPerWorker);
    }

    const minutes = Array.from(workerMinutes.values());

    return stdDev(1, minutes);
  },
};
