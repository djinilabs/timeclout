import { eventBus } from "@/event-bus";
import { leaveTypeParser } from "@/settings";
import { database, ResourceRef, resourceRef } from "@/tables";
import { notFound } from "@hapi/boom";
import { isLeaveRequestFullyApproved } from "./isLeaveRequestFullyApproved";

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
  const { leave_request, entity_settings, leave } = await database();

  const leaveTypeSettingsUnparsed = await entity_settings.get(
    companyPk,
    "leaveTypes"
  );

  if (!leaveTypeSettingsUnparsed) {
    throw notFound("Company leave type settings not found");
  }

  const leaveTypeSettings = leaveTypeParser.parse(
    leaveTypeSettingsUnparsed.settings
  );

  const leaveType = leaveTypeSettings.find(
    (type) => type.name === leaveTypeName
  );

  if (!leaveType) {
    throw notFound("Leave type not found");
  }

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
    (await isLeaveRequestFullyApproved(leaveRequest, userPk))
  ) {
    let startDate = new Date(startDateAsString);
    const endDate = new Date(endDateAsString);
    while (startDate <= endDate) {
      const newLeave = {
        pk: `${companyPk}/${userPk}`,
        sk: startDate.toISOString().split("T")[0],
        type: leaveTypeName,
        leaveRequestPk: leaveRequest.pk,
        createdBy: userPk,
      };
      console.log("creating newLeave", newLeave);
      await leave.create(newLeave);

      // Move to next day
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 1);
      startDate = nextDate;
    }
  }

  await eventBus().emit({
    key: "createLeaveRequest",
    value: {
      leaveRequest,
    },
  });

  return leaveRequest;
};
