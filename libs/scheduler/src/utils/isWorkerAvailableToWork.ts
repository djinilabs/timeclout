import { SlotWorker, SlotWorkHour } from "../types";
import { isWorkerAvailableToWorkBetween } from "./isWorkerAvailableToWorkBetween";
export const isWorkerAvailableToWork = (
  worker: SlotWorker,
  slots: SlotWorkHour[],
  resting: Array<[number, number]>
) => {
  for (const slot of slots) {
    const { start: workStart, end: workEnd } = slot;
    if (!isWorkerAvailableToWorkBetween(worker, workStart, workEnd)) {
      return false;
    }
    if (resting.some(([start, end]) => start <= workEnd && end >= workStart)) {
      return false;
    }
  }
  return true;
};
