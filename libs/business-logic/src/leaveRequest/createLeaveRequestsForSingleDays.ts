import { badRequest } from "@hapi/boom";

import { approveLeaveRequest } from "./approveLeaveRequest";
import { getLeaveType } from "./getLeaveType";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";
import { leaveRequestOverlaps } from "./leaveRequestOverlaps";

import { eventBus } from "@/event-bus";
import { i18n } from "@/locales";
import { database, LeaveRequestRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export interface CreateLeaveRequestForSingleDayOptions {
  companyPk: ResourceRef;
  userPk: ResourceRef;
  actingUserPk?: ResourceRef;
  leaveTypeName: string;
  datesAsStrings: string[];
  reason: string;
}

export const createLeaveRequestsForSingleDays = async ({
  companyPk,
  userPk,
  actingUserPk = userPk,
  leaveTypeName,
  datesAsStrings,
  reason,
}: CreateLeaveRequestForSingleDayOptions) => {
  const { leave_request } = await database();
  const leaveType = await getLeaveType(companyPk, leaveTypeName);

  const leaveRequests = await Promise.all(
    datesAsStrings.map(async (day): Promise<LeaveRequestRecord> => {
      const leaveRequestCandidate: LeaveRequestRecord = {
        pk: `${companyPk}/${userPk}`,
        sk: `${day}/${day}/${leaveTypeName}`,
        version: 1,
        type: leaveTypeName,
        startDate: day,
        endDate: day,
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
            "Leave request overlaps with existing {type} of type {culpritType} for day {day}",
            {
              type: leaves.length > 0 ? "leave" : "leave request",
              culpritType: culprit.type,
              day,
            }
          )
        );
      }
      return leaveRequestCandidate;
    })
  );

  for (const leaveRequestCandidate of leaveRequests) {
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
  }

  return leaveRequests;
};
