import { LeaveRecord, LeaveRequestRecord } from "@/tables";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";
import { getLeavesForDateRange } from "../leave/getLeavesForDateRange";
import { getLeaveRequestsForDateRange } from "./getLeaveRequestsForDateRange";

export const leaveRequestOverlaps = async (
  leaveRequest: LeaveRequestRecord
): Promise<[boolean, LeaveRecord[], LeaveRequestRecord[]]> => {
  const { companyRef, userRef } = parseLeaveRequestPk(leaveRequest.pk);
  const leaves = await getLeavesForDateRange(
    companyRef,
    userRef,
    leaveRequest.startDate,
    leaveRequest.endDate
  );
  if (leaves.length > 0) {
    return [true, leaves, []];
  }

  const leaveRequests = (
    await getLeaveRequestsForDateRange(
      companyRef,
      userRef,
      leaveRequest.startDate,
      leaveRequest.endDate
    )
  ).filter((request) => request.pk !== leaveRequest.pk);
  if (leaveRequests.length > 0) {
    return [true, leaves, leaveRequests];
  }
  return [false, [], []];
};
