import { notAcceptable } from "@hapi/boom";

import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";
import { leaveRequestOverlaps } from "./leaveRequestOverlaps";

import { i18n } from "@/locales";
import { database, LeaveRequestRecord } from "@/tables";
import { ResourceRef, unique } from "@/utils";

export const approveLeaveRequest = async (
  leaveRequest: LeaveRequestRecord,
  approverPk: ResourceRef
) => {
  // If the leave request is already approved, we still need to create leave records
  // so we don't return early

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

  const { leave_request, leave } = await database();

  // Only update approval status if the leave request is not already approved
  if (!leaveRequest.approved) {
    const approvalsSoFar = leaveRequest.approvedBy ?? [];
    const newApprovals = unique([...approvalsSoFar, approverPk]);
    const indexOfNewApproval = newApprovals.indexOf(approverPk);
    const approvedBySoFar = leaveRequest.approvedAt ?? [];
    const newApprovedDates = [...approvedBySoFar];
    newApprovedDates[indexOfNewApproval] = new Date().toISOString();

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
  }

  let startDate = new Date(leaveRequest.startDate);
  const endDate = new Date(leaveRequest.endDate);
  console.log(
    `📅 Creating leave records from ${
      startDate.toISOString().split("T")[0]
    } to ${endDate.toISOString().split("T")[0]}`
  );

  while (startDate <= endDate) {
    const newLeave = {
      pk: leaveRequest.pk,
      sk: startDate.toISOString().split("T")[0],
      type: leaveRequest.type,
      leaveRequestPk: leaveRequest.pk,
      leaveRequestSk: leaveRequest.sk,
      createdBy: leaveRequest.createdBy,
      createdAt: new Date().toISOString(),
    };

    console.log(
      `✅ Creating leave record for ${startDate.toISOString().split("T")[0]}:`,
      newLeave
    );
    await leave.create(newLeave);
    console.log(
      `✅ Successfully created leave record for ${
        startDate.toISOString().split("T")[0]
      }`
    );

    // Move to next day
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);
    startDate = nextDate;
  }

  console.log(
    `🎉 Successfully created all leave records for leave request ${leaveRequest.pk}/${leaveRequest.sk}`
  );
};
