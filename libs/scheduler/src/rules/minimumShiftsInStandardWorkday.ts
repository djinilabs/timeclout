import { SlotWorker, ValidationRule } from "../types";

export const minimumShiftsInStandardWorkday: ValidationRule = (
  schedule,
  _workers,
  minimumStandardWorkDayShiftCount
) => {
  if (
    minimumStandardWorkDayShiftCount == null ||
    typeof minimumStandardWorkDayShiftCount !== "number"
  ) {
    throw new TypeError("minimumShiftsInStandardWorkday must be a number");
  }
  const workerShiftCounts = new Map<SlotWorker, number>();
  for (const shift of schedule.shifts) {
    const worker = shift.assigned;
    let workerShiftCount = workerShiftCounts.get(worker) ?? 0;
    if (shift.slot.startsOnStandardWorkDay) {
      workerShiftCount += 1;
    }
    workerShiftCounts.set(worker, workerShiftCount);
  }

  for (const workerShiftCount of workerShiftCounts.values()) {
    if (workerShiftCount < minimumStandardWorkDayShiftCount) {
      return false;
    }
  }
  return true;
};
