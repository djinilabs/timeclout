import { ShiftScheduleHeuristic, SlotWorker, ShiftSchedule } from "../types";
import { calculateExpectedTotalInconveniencePerWorker } from "../utils/calculateExpectedTotalInconveniencePerWorker";
import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";
import { stdDev } from "../utils/standardDeviation";
import { calculateWorkerUnavailabilityRatio } from "../utils/calculateWorkerUnavailabilityRatio";

export const calculateExpectedWorkerInconvenienceEquality = (
  schedule: ShiftSchedule
) => {
  const expectedTotalInconveniencePerWorker =
    calculateExpectedTotalInconveniencePerWorker(schedule);
  const [, workerUnavailabilityRatio] =
    calculateWorkerUnavailabilityRatio(schedule);
  return { expectedTotalInconveniencePerWorker, workerUnavailabilityRatio };
};

export const calculateWorkerInconveniences = (schedule: ShiftSchedule) => {
  const { expectedTotalInconveniencePerWorker, workerUnavailabilityRatio } =
    calculateExpectedWorkerInconvenienceEquality(schedule);

  const workerInconveniences: Map<SlotWorker, number> = new Map();

  for (const shift of schedule.shifts) {
    const currentInconvenience = workerInconveniences.get(shift.assigned) ?? 0;
    workerInconveniences.set(
      shift.assigned,
      currentInconvenience + calculateSlotInconvenience(shift.slot)
    );
  }

  const normalizedWorkerInconveniences = new Map<SlotWorker, number>();
  // equalize inconvenience per worker by calculating and applying the ratio of the worker's unavailability
  // for unavailability ratio we only take into consideration the shifts that the worker is unavailable for work reasons
  for (const [worker, workerInconvenience] of workerInconveniences.entries()) {
    const ratio = workerUnavailabilityRatio(worker);
    normalizedWorkerInconveniences.set(
      worker,
      workerInconvenience / ratio / expectedTotalInconveniencePerWorker
    );
  }

  return normalizedWorkerInconveniences;
};

export const calculateWorkerInconvenienceEqualityDeviation = (
  schedule: ShiftSchedule
) => {
  const inconveniences = calculateWorkerInconveniences(schedule);
  return stdDev(1, Array.from(inconveniences.values()));
};

export const workerInconvenienceEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Inconvenience Equality",
  eval: (schedule) => calculateWorkerInconvenienceEqualityDeviation(schedule),
};
