import { SlotWorker, SlotWorkHour } from "../types";
import { isWorkerAvailableToWorkBetween } from "./isWorkerAvailableToWorkBetween";
export const isWorkerAvailableToWork = (
  worker: SlotWorker,
  slots: SlotWorkHour[]
) => {
  for (const slot of slots) {
    const { start: workStart, end: workEnd } = slot;
    if (!isWorkerAvailableToWorkBetween(worker, workStart, workEnd)) {
      return false;
    }
  }
  return true;
};
