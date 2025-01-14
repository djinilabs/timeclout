import { eventBus } from "@/event-bus";
import { leaveTypeParser } from "@/settings";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";
import { ResourceRef } from "@/utils";
import { approveLeaveRequest } from "./approveLeaveRequest";
import { getLeaveType } from "./getLeaveType";
export interface CreateLeaveRequestOptions {
  companyPk: ResourceRef;
  userPk: ResourceRef;
  leaveTypeName: string;
  startDateAsString: string;
  endDateAsString: string;
  reason: string;
}

export const createLeaveRequest = async ({
  companyPk,
  userPk,
  leaveTypeName,
  startDateAsString,
  endDateAsString,
  reason,
}: CreateLeaveRequestOptions) => {
  const { leave_request } = await database();

  const leaveType = await getLeaveType(companyPk, leaveTypeName);

  const leaveRequest = await leave_request.create({
    pk: `${companyPk}/${userPk}`,
    sk: `${startDateAsString}/${endDateAsString}/${leaveTypeName}`,
    type: leaveTypeName,
    startDate: startDateAsString,
    endDate: endDateAsString,
    reason,
    createdBy: userPk,
    approved: !leaveType.needsManagerApproval,
    approvedBy: leaveType.needsManagerApproval ? [] : [userPk],
    approvedAt: leaveType.needsManagerApproval
      ? []
      : [new Date().toISOString()],
  });

  if (
    !leaveType.needsManagerApproval ||
    (await isLeaveRequestFullyApproved(leaveRequest))
  ) {
    await approveLeaveRequest(leaveRequest, userPk);
  } else {
    await eventBus().emit({
      key: "createOrUpdateLeaveRequest",
      value: {
        leaveRequest,
      },
    });
  }

  return leaveRequest;
};
