import { ShiftScheduleHeuristic, SlotWorker } from "../types";
import { calculateExpectedTotalInconveniencePerWorker } from "../utils/calculateExpectedTotalInconveniencePerWorker";
import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";
import { getDefined } from "../utils/getDefined";
import { stdDev } from "../utils/standardDeviation";

export const workerInconvenienceEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Inconvenience Equality",
  eval: (schedule) => {
    const expectedTotalInconveniencePerWorker =
      calculateExpectedTotalInconveniencePerWorker(schedule);

    const workerInconveniences: Map<SlotWorker, number> = new Map();

    for (const shift of schedule.shifts) {
      let index = 0;
      for (const worker of shift.assigned) {
        const currentInconvenience = workerInconveniences.get(worker) ?? 0;
        workerInconveniences.set(
          worker,
          currentInconvenience +
            calculateSlotInconvenience(
              getDefined(
                shift.slot.members[index],
                `Slot member ${index} not found`
              )
            )
        );
        index++;
      }
    }

    for (const [worker, workerSlotCount] of workerInconveniences.entries()) {
      const workerUnavailabilityRatio =
        (schedule.shifts.length -
          worker.unavailableForWorkReasonsShiftCount()) /
        schedule.shifts.length;
      workerInconveniences.set(
        worker,
        workerSlotCount /
          workerUnavailabilityRatio /
          expectedTotalInconveniencePerWorker
      );
    }

    const inconveniences = Array.from(workerInconveniences.values());

    return stdDev(1, inconveniences);
  },
};
