import { SlotWorker, SlotWorkerLeave } from "../types";

const doesLeaveConflictWithWork = (
  leave: SlotWorkerLeave,
  startTime: number,
  endTime: number
) => {
  return leave.start <= endTime && leave.end >= startTime;
};

const doesAnyLeaveConflictWithWork = (
  leaves: SlotWorkerLeave[],
  startTime: number,
  endTime: number
) => {
  return leaves.some((leave) =>
    doesLeaveConflictWithWork(leave, startTime, endTime)
  );
};
export const isWorkerAvailableToWorkBetween = (
  worker: SlotWorker,
  startTime: number,
  endTime: number,
  respectLeaveSchedule: boolean
) => {
  if (!respectLeaveSchedule) {
    return true;
  }
  return !doesAnyLeaveConflictWithWork(
    worker.approvedLeaves,
    startTime,
    endTime
  );
};
