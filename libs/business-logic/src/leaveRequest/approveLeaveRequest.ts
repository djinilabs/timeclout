import { database, LeaveRequestRecord } from "@/tables";
import { ResourceRef, unique } from "@/utils";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";
import { leaveRequestOverlaps } from "./leaveRequestOverlaps";
import { notAcceptable } from "@hapi/boom";
import { i18n } from "@/locales";

export const approveLeaveRequest = async (
  leaveRequest: LeaveRequestRecord,
  approverPk: ResourceRef
) => {
  if (leaveRequest.approved) {
    return leaveRequest;
  }

  const [overlaps, leaves, leaveRequests] = await leaveRequestOverlaps(
    leaveRequest
  );

  if (overlaps) {
    const culprit = leaves.length > 0 ? leaves[0] : leaveRequests[0];
    throw notAcceptable(
      i18n._(
        "Leave request overlaps with existing {type} of type {culpritType}",
        {
          type: leaves.length > 0 ? "leave" : "leave request",
          culpritType: culprit.type,
        }
      )
    );
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
      leaveRequestSk: leaveRequest.sk,
      createdBy: leaveRequest.createdBy,
    };
    await leave.create(newLeave);

    // Move to next day
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);
    startDate = nextDate;
  }
};
