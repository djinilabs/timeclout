import type { ShiftScheduleHeuristic, ShiftSchedule } from "../types";
import { calculateExpectedTotalInconveniencePerWorker } from "../utils/calculateExpectedTotalInconveniencePerWorker";
import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";
import { calculateWorkerUnavailabilityRatio } from "../utils/calculateWorkerUnavailabilityRatio";
import { stdDev as standardDeviation } from "../utils/standardDeviation";

export const calculateExpectedWorkerInconvenienceEquality = (
  schedule: ShiftSchedule
) => {
  const expectedTotalInconveniencePerWorker =
    calculateExpectedTotalInconveniencePerWorker(schedule);
  const [, workerUnavailabilityRatio] =
    calculateWorkerUnavailabilityRatio(schedule);
  return { expectedTotalInconveniencePerWorker, workerUnavailabilityRatio };
};

export const calculateWorkerInconveniences = (
  schedule: ShiftSchedule
): Map<string, number> => {
  const { expectedTotalInconveniencePerWorker, workerUnavailabilityRatio } =
    calculateExpectedWorkerInconvenienceEquality(schedule);

  const workerInconveniences: Map<string, number> = new Map();

  for (const shift of schedule.shifts) {
    const currentInconvenience =
      workerInconveniences.get(shift.assigned.pk) ?? 0;
    workerInconveniences.set(
      shift.assigned.pk,
      currentInconvenience + calculateSlotInconvenience(shift.slot)
    );
  }

  const normalizedWorkerInconveniences = new Map<string, number>();
  // equalize inconvenience per worker by calculating and applying the ratio of the worker's unavailability
  // for unavailability ratio we only take into consideration the shifts that the worker is unavailable for work reasons
  for (const [
    workerPk,
    workerInconvenience,
  ] of workerInconveniences.entries()) {
    const ratio = workerUnavailabilityRatio(workerPk);
    normalizedWorkerInconveniences.set(
      workerPk,
      workerInconvenience / ratio / expectedTotalInconveniencePerWorker
    );
  }

  return normalizedWorkerInconveniences;
};

export const calculateWorkerInconvenienceEqualityDeviation = (
  schedule: ShiftSchedule
) => {
  const inconveniences = calculateWorkerInconveniences(schedule);
  return standardDeviation(1, [...inconveniences.values()]);
};

export const workerInconvenienceEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Inconvenience Equality",
  eval: (schedule) => calculateWorkerInconvenienceEqualityDeviation(schedule),
};
