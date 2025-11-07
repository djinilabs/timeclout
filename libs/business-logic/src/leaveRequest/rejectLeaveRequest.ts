import { eventBus } from "@/event-bus";
import { database, LeaveRequestRecord, EntityRecord } from "@/tables";

export const rejectLeaveRequest = async (
  leaveRequest: LeaveRequestRecord,
  rejecter: EntityRecord
) => {
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

  await leave_request.delete(leaveRequest.pk, leaveRequest.sk);

  await eventBus().emit({
    key: "rejectLeaveRequest",
    value: {
      leaveRequest,
      rejecter,
    },
  });
};
