import { SlotWorker } from "../types";

export const isWorkerAvailableToWorkBetween = (
  worker: SlotWorker,
  startTime: number,
  endTime: number
) =>
  worker.approvedLeaves.every((leave) => {
    return leave.start <= endTime && leave.end >= startTime;
  });
