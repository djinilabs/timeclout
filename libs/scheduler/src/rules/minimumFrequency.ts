import { SlotWorker, ValidationRule } from "../types";

const workerUnavailablityInSecondsBetween = (
  worker: SlotWorker,
  startTime: number,
  endTime: number
) => {
  if (startTime > endTime) {
    throw new TypeError("startTime must be less than endTime");
  }
  // counts the amount of seconds the worker is unavailable between the start and end time
  return worker.approvedLeaves.reduce((acc, leave) => {
    if (leave.start <= endTime && leave.end >= startTime) {
      return acc + (leave.end - leave.start);
    }
    return acc;
  }, 0);
};

export const minimumFrequency: ValidationRule = (
  schedule,
  workers,
  minimumFrequency
) => {
  if (typeof minimumFrequency !== "number") {
    throw new TypeError("minimumFrequency must be a number");
  }
  const previousShifts = new Map(workers.map((worker) => [worker, 0]));

  const isShiftValid = (worker: SlotWorker, startTime: number) => {
    const previousShiftStartTime = previousShifts.get(worker);
    if (
      previousShiftStartTime != null &&
      startTime -
        previousShiftStartTime -
        workerUnavailablityInSecondsBetween(
          worker,
          previousShiftStartTime,
          startTime
        ) >
        minimumFrequency
    ) {
      return false;
    }
    return true;
  };

  for (const shift of schedule.shifts) {
    if (!isShiftValid(shift.assigned, shift.slot.workHours[0].start)) {
      return false;
    }
    previousShifts.set(shift.assigned, shift.slot.workHours[0].start);
  }

  // simulate a last shift to check if all workers have scheduled work until the end
  return workers.every((worker) =>
    isShiftValid(worker, schedule.shifts.length)
  );
};
