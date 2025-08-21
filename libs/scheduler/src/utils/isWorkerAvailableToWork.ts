import { SlotWorker, SlotWorkHour } from "../types";

import { dayAndMinutesToDate } from "./dayAndMinutesToTime";
import { isWorkerAvailableToWorkBetween } from "./isWorkerAvailableToWorkBetween";

export const isWorkerAvailableToWork = (
  worker: SlotWorker,
  slots: SlotWorkHour[],
  resting: ReadonlyArray<[number, number]>,
  respectLeaveSchedule: boolean,
  startDay: string
): [boolean, string?] => {
  for (const slot of slots) {
    const { start: workStart, end: workEnd } = slot;
    const [available, reason] = isWorkerAvailableToWorkBetween(
      worker,
      startDay,
      workStart,
      workEnd,
      respectLeaveSchedule
    );
    if (!available) {
      return [false, reason];
    }
    const restingPeriod = resting.find(
      ([start, end]) => start <= workEnd && end >= workStart
    );
    if (restingPeriod) {
      return [
        false,
        `Worker ${worker.name} is on rest leave between ${dayAndMinutesToDate(
          startDay,
          workStart
        )} and ${dayAndMinutesToDate(startDay, workEnd)}.`,
      ];
    }
  }
  return [true];
};
