import { SlotWorker, SlotWorkerLeave } from "../types";

import { dayAndMinutesToDate } from "./dayAndMinutesToTime";

const leaveDoesNotConflictWithWork = (
  worker: SlotWorker,
  leave: SlotWorkerLeave,
  startDay: string,
  startTime: number,
  endTime: number
): [boolean, string?] => {
  if (leave.start <= endTime && leave.end >= startTime) {
    return [
      false,
      `Worker ${worker.name} has a ${leave.type} leave that conflicts with work between ${dayAndMinutesToDate(
        startDay,
        startTime
      )} and ${dayAndMinutesToDate(startDay, endTime)}.`,
    ];
  }
  return [true];
};

const noLeaveConflictsWithWork = (
  worker: SlotWorker,
  startDay: string,
  startTime: number,
  endTime: number
): [boolean, string?] => {
  for (const leave of worker.approvedLeaves) {
    const [available, reason] = leaveDoesNotConflictWithWork(
      worker,
      leave,
      startDay,
      startTime,
      endTime
    );
    if (!available) {
      return [false, reason];
    }
  }
  return [true];
};
export const isWorkerAvailableToWorkBetween = (
  worker: SlotWorker,
  startDay: string,
  startTime: number,
  endTime: number,
  respectLeaveSchedule: boolean
): [boolean, string?] => {
  if (!respectLeaveSchedule) {
    return [true];
  }
  return noLeaveConflictsWithWork(worker, startDay, startTime, endTime);
};
