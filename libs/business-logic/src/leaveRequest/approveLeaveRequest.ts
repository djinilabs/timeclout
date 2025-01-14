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
  const { leave_request, leave } = await database();
  const newLeaveRequest = {
    ...leaveRequest,
    approvedBy: newApprovals,
    approvedAt: newApprovedDates,
    updatedBy: approverPk,
    updatedAt: new Date().toISOString(),
  };
  await leave_request.update({
    ...newLeaveRequest,
    approved: await isLeaveRequestFullyApproved(newLeaveRequest),
  });

  let startDate = new Date(leaveRequest.startDate);
  const endDate = new Date(leaveRequest.endDate);
  while (startDate <= endDate) {
    const newLeave = {
      pk: leaveRequest.pk,
      sk: startDate.toISOString().split("T")[0],
      type: leaveRequest.type,
      leaveRequestPk: leaveRequest.pk,
      createdBy: leaveRequest.createdBy,
    };
    console.log("creating new Leave", newLeave);
    await leave.create(newLeave);

    // Move to next day
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);
    startDate = nextDate;
  }
};
