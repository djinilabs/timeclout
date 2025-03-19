import { SlotWorker } from "../types";

export const isWorkerAvailableToWorkBetween = (
  worker: SlotWorker,
  startTime: number,
  endTime: number,
  respectLeaveSchedule: boolean
) => {
  if (!respectLeaveSchedule) {
    return true;
  }
  return !worker.approvedLeaves.some((leave) => {
    return leave.start <= endTime && leave.end >= startTime;
  });
};
