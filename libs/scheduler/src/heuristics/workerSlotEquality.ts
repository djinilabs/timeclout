import { ShiftScheduleHeuristic, ShiftSchedule } from "../types";
import { calculateWorkerUnavailabilityRatio } from "../utils/calculateWorkerUnavailabilityRatio";
import { countTotalMinutesInSlot } from "../utils/countTotalMinutesInSlot";
import { stdDev } from "../utils/standardDeviation";

export const calculateExpectedWorkerSlotEquality = (
  schedule: ShiftSchedule
) => {
  const [expectedMinutesPerWorker, workerUnavailabilityRatio] =
    calculateWorkerUnavailabilityRatio(schedule);
  return { expectedMinutesPerWorker, workerUnavailabilityRatio };
};

export const calculateWorkerSlotMinutes = (
  schedule: ShiftSchedule
): Map<string, number> => {
  const { expectedMinutesPerWorker, workerUnavailabilityRatio } =
    calculateExpectedWorkerSlotEquality(schedule);

  const workerMinutes: Map<string, number> = new Map();

  for (const shift of schedule.shifts) {
    const currentSlotCount = workerMinutes.get(shift.assigned.pk) ?? 0;
    workerMinutes.set(
      shift.assigned.pk,
      currentSlotCount + countTotalMinutesInSlot(shift.slot)
    );
  }

  const normalizedWorkerMinutes = new Map<string, number>();
  for (const [workerPk, minutes] of workerMinutes.entries()) {
    const ratio = workerUnavailabilityRatio(workerPk);
    normalizedWorkerMinutes.set(
      workerPk,
      minutes / ratio / expectedMinutesPerWorker
    );
  }

  return normalizedWorkerMinutes;
};

export const calculateWorkerSlotEqualityDeviation = (
  schedule: ShiftSchedule
) => {
  const minutes = calculateWorkerSlotMinutes(schedule);
  return stdDev(1, Array.from(minutes.values()));
};

export const workerSlotEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Equality",
  eval: (schedule) => calculateWorkerSlotEqualityDeviation(schedule),
};
