import { eventBus } from "@/event-bus";
import { database, LeaveRequestRecord } from "@/tables";
import { badRequest } from "@hapi/boom";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";
import { ResourceRef } from "@/utils";
import { approveLeaveRequest } from "./approveLeaveRequest";
import { getLeaveType } from "./getLeaveType";
import { leaveRequestOverlaps } from "./leaveRequestOverlaps";
import { i18n } from "@/locales";

export interface CreateLeaveRequestOptions {
  companyPk: ResourceRef;
  userPk: ResourceRef;
  actingUserPk?: ResourceRef;
  leaveTypeName: string;
  startDateAsString: string;
  endDateAsString: string;
  reason: string;
}

export const createLeaveRequest = async ({
  companyPk,
  userPk,
  actingUserPk = userPk,
  leaveTypeName,
  startDateAsString,
  endDateAsString,
  reason,
}: CreateLeaveRequestOptions) => {
  const { leave_request } = await database();
  const leaveType = await getLeaveType(companyPk, leaveTypeName);

  const leaveRequestCandidate: LeaveRequestRecord = {
    pk: `${companyPk}/${userPk}`,
    sk: `${startDateAsString}/${endDateAsString}/${leaveTypeName}`,
    version: 1,
    type: leaveTypeName,
    startDate: startDateAsString,
    endDate: endDateAsString,
    companyPk,
    userPk,
    reason,
    createdAt: new Date().toISOString(),
    createdBy: actingUserPk,
    approved: !leaveType.needsManagerApproval,
    approvedBy: leaveType.needsManagerApproval ? [] : [actingUserPk],
    approvedAt: leaveType.needsManagerApproval
      ? []
      : [new Date().toISOString()],
  };
  const [overlaps, leaves, leaveRequests] = await leaveRequestOverlaps(
    leaveRequestCandidate
  );

  if (overlaps) {
    const culprit = leaves.length > 0 ? leaves[0] : leaveRequests[0];
    throw badRequest(
      i18n._(
        "Leave request overlaps with existing {type} of type {culpritType}",
        {
          type: leaves.length > 0 ? "leave" : "leave request",
          culpritType: culprit.type,
        }
      )
    );
  }

  const leaveRequest = await leave_request.create(leaveRequestCandidate);

  if (
    !leaveType.needsManagerApproval ||
    (await isLeaveRequestFullyApproved(leaveRequest))
  ) {
    console.log(
      "@/business-logic/leaveRequest/createLeaveRequest.ts: approving leave request",
      leaveRequest
    );
    await approveLeaveRequest(leaveRequest, actingUserPk);
  } else {
    console.log(
      "@/business-logic/leaveRequest/createLeaveRequest.ts: not approving leave request",
      leaveRequest
    );
    await eventBus().emit({
      key: "createOrUpdateLeaveRequest",
      value: {
        leaveRequest,
      },
    });
  }

  return leaveRequest;
};
