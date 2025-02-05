import { SlotWorker, ValidationRule } from "../types";

const workerUnavailablityCountForSlots = (
  worker: SlotWorker,
  startSlot: number,
  endSlot: number
) => {
  if (startSlot > endSlot) {
    throw new TypeError("startSlot must be less than endSlot");
  }
  let unavailableCount = 0;
  for (let i = startSlot; i < endSlot; i++) {
    if (!worker.isAvailableToWork(i)) {
      unavailableCount += 1;
    }
  }
  return unavailableCount;
};

export const minimumFrequency: ValidationRule = (
  schedule,
  workers,
  minimumFrequency
) => {
  if (typeof minimumFrequency !== "number") {
    return true;
  }
  const previousShifts = new Map(workers.map((worker) => [worker, -1]));

  const isShiftValid = (worker: SlotWorker, slot: number) => {
    const previousShift = previousShifts.get(worker);
    if (
      previousShift != null &&
      slot -
        previousShift -
        workerUnavailablityCountForSlots(worker, previousShift, slot) >
        minimumFrequency
    ) {
      return false;
    }
    return true;
  };

  schedule.shifts.forEach((shift, slot) => {
    shift.assigned.forEach((worker) => {
      if (!isShiftValid(worker, slot)) {
        return false;
      }
      previousShifts.set(worker, slot);
    });
  });

  // simulate a last shift to check if all workers have scheduled work until the end
  return workers.every((worker) =>
    isShiftValid(worker, schedule.shifts.length)
  );
};
