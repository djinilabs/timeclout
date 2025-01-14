import { database, LeaveRequestRecord } from "@/tables";
import { ResourceRef, unique } from "@/utils";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";

export const approveLeaveRequest = async (
  leaveRequest: LeaveRequestRecord,
  approverPk: ResourceRef
) => {
  if (leaveRequest.approved) {
    return leaveRequest;
  }

  const approvalsSoFar = leaveRequest.approvedBy ?? [];
  const newApprovals = unique([...approvalsSoFar, approverPk]);
  const indexOfNewApproval = newApprovals.indexOf(approverPk);
  const approvedBySoFar = leaveRequest.approvedAt ?? [];
  const newApprovedDates = [...approvedBySoFar];
  newApprovedDates[indexOfNewApproval] = new Date().toISOString();
  const { leave_request } = await database();
  const newLeaveRequest = {
    ...leaveRequest,
    approvedBy: newApprovals,
    approvedAt: newApprovedDates,
    updatedBy: approverPk,
    updatedAt: new Date().toISOString(),
  };
  return leave_request.update({
    ...newLeaveRequest,
    approved: await isLeaveRequestFullyApproved(newLeaveRequest),
  });
};
