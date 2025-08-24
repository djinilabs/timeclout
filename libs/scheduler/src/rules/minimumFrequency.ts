import { SlotWorker, ValidationRule } from "../types";

import { i18n } from "@/locales";

const workerUnavailablityInSecondsBetween = (
  worker: SlotWorker,
  startTime: number,
  endTime: number
) => {
  if (startTime > endTime) {
    throw new TypeError(i18n._("startTime must be less than endTime"));
  }
  // counts the amount of seconds the worker is unavailable between the start and end time
  return worker.approvedLeaves.reduce((accumulator, leave) => {
    if (leave.start <= endTime && leave.end >= startTime) {
      return accumulator + (leave.end - leave.start);
    }
    return accumulator;
  }, 0);
};

export const minimumFrequency: ValidationRule = {
  id: "minimumFrequency",
  name: (ruleOptions) => {
    if (typeof ruleOptions !== "number") {
      throw new TypeError(i18n._("minimumFrequency must be a number"));
    }
    return `Minimum Frequency of ${ruleOptions / 24 / 60} days`;
  },
  function: (schedule, workers, minimumFrequency) => {
    if (typeof minimumFrequency !== "number") {
      throw new TypeError(i18n._("minimumFrequency must be a number"));
    }
    const previousShifts = new Map(workers.map((worker) => [worker, 0]));

    const isShiftValid = (worker: SlotWorker, startTime: number) => {
      const previousShiftStartTime = previousShifts.get(worker);
      if (
        previousShiftStartTime != undefined &&
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
        return [false, shift.slot.id];
      }
      previousShifts.set(shift.assigned, shift.slot.workHours[0].start);
    }
    return [true];
  },
};
