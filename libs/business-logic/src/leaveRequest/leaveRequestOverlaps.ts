import { getLeavesForDateRange } from "../leave/getLeavesForDateRange";

import { getLeaveRequestsForDateRange } from "./getLeaveRequestsForDateRange";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";

import { DayDate } from "@/day-date";
import { LeaveRecord, LeaveRequestRecord } from "@/tables";

export const leaveRequestOverlaps = async (
  leaveRequest: LeaveRequestRecord
): Promise<[boolean, LeaveRecord[], LeaveRequestRecord[]]> => {
  const { companyRef, userRef } = parseLeaveRequestPk(leaveRequest.pk);
  const leaves = await getLeavesForDateRange(
    companyRef,
    userRef,
    new DayDate(leaveRequest.startDate),
    new DayDate(leaveRequest.endDate)
  );
  if (leaves.length > 0) {
    return [true, leaves, []];
  }

  const leaveRequests = (
    await getLeaveRequestsForDateRange(
      companyRef,
      userRef,
      new DayDate(leaveRequest.startDate),
      new DayDate(leaveRequest.endDate)
    )
  ).filter((request) => request.pk !== leaveRequest.pk);
  if (leaveRequests.length > 0) {
    return [true, leaves, leaveRequests];
  }
  return [false, [], []];
};
