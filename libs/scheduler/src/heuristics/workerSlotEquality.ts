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

export const calculateWorkerSlotEqualityDeviation = (
  schedule: ShiftSchedule
) => {
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

  for (const [worker, minutes] of workerMinutes.entries()) {
    const ratio = workerUnavailabilityRatio(worker);
    workerMinutes.set(worker, minutes / ratio / expectedMinutesPerWorker);
  }

  const minutes = Array.from(workerMinutes.values());

  return stdDev(1, minutes);
};

export const workerSlotEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Equality",
  eval: (schedule) => calculateWorkerSlotEqualityDeviation(schedule),
};
