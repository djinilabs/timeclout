import { database, LeaveRequestRecord } from "@/tables";
import { ResourceRef } from "@/utils";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";
import { getLeaveType } from "./getLeaveType";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";
import { approveLeaveRequest } from "./approveLeaveRequest";
import { eventBus } from "@/event-bus";

export interface UpdateLeaveRequestOptions {
  leaveRequest: LeaveRequestRecord;
  userPk: ResourceRef;
  leaveTypeName: string;
  startDateAsString: string;
  endDateAsString: string;
  reason: string;
}

export const updateLeaveRequest = async ({
  leaveRequest,
  userPk,
  leaveTypeName,
  startDateAsString,
  endDateAsString,
  reason,
}: UpdateLeaveRequestOptions) => {
  const { leave_request, leave } = await database();

  // if was approved, remove all respective leave records
  if (leaveRequest.approved) {
    const { items: leaveRecords } = await leave.query({
      IndexName: "byLeaveRequestPkAndSk",
      KeyConditionExpression:
        "leaveRequestPk = :leaveRequestPk AND leaveRequestSk = :leaveRequestSk",
      ExpressionAttributeValues: {
        ":leaveRequestPk": leaveRequest.pk,
        ":leaveRequestSk": leaveRequest.sk,
      },
    });

    for (const leaveRecord of leaveRecords) {
      await leave.delete(leaveRecord.pk);
    }
  }

  const newLeaveRequest = {
    ...leaveRequest,
    type: leaveTypeName,
    startDate: startDateAsString,
    endDate: endDateAsString,
    reason: reason,
  };

  await leave_request.update(newLeaveRequest);

  const { companyRef } = parseLeaveRequestPk(leaveRequest.pk);

  const leaveType = await getLeaveType(companyRef, newLeaveRequest.type);

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

  return newLeaveRequest;
};
