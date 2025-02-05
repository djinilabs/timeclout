import { getDefined } from "@/utils";
import { SlotWorker, ValidationRule } from "../types";

export const minimumShiftsInStandardWorkday: ValidationRule = (
  schedule,
  _workers,
  config
) => {
  if (config == null || typeof config !== "number") {
    return true;
  }
  const minimumStandardWorkDayShiftCount = config;
  const workerShiftCount = new Map<SlotWorker, number>();
  for (const shift of schedule.shifts) {
    let index = 0;
    for (const worker of shift.assigned) {
      if (
        getDefined(shift.slot.members[index], `Slot member ${index} not found`)
          .startsOnStandardWorkDay
      ) {
        const currentShiftCount = (workerShiftCount.get(worker) ?? 0) + 1;
        if (currentShiftCount < minimumStandardWorkDayShiftCount) {
          return false;
        }
        workerShiftCount.set(worker, currentShiftCount);
      }
      index++;
    }
  }
  return true;
};
