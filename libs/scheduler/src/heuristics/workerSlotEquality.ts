import { ShiftScheduleHeuristic, SlotWorker, ShiftSchedule } from "../types";
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

export const calculateWorkerSlotMinutes = (schedule: ShiftSchedule) => {
  const { expectedMinutesPerWorker, workerUnavailabilityRatio } =
    calculateExpectedWorkerSlotEquality(schedule);

  const workerMinutes: Map<SlotWorker, number> = new Map();

  for (const shift of schedule.shifts) {
    const currentSlotCount = workerMinutes.get(shift.assigned) ?? 0;
    workerMinutes.set(
      shift.assigned,
      currentSlotCount + countTotalMinutesInSlot(shift.slot)
    );
  }

  const normalizedWorkerMinutes = new Map<SlotWorker, number>();
  for (const [worker, minutes] of workerMinutes.entries()) {
    const ratio = workerUnavailabilityRatio(worker);
    normalizedWorkerMinutes.set(
      worker,
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
