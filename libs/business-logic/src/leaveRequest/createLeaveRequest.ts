import { eventBus } from "@/event-bus";
import { leaveTypeParser } from "@/settings";
import { database, resourceRef } from "@/tables";
import { notFound } from "@hapi/boom";

export interface CreateLeaveRequestOptions {
  companyPk: string;
  userPk: string;
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

  console.log("leaveTypeSettingsUnparsed", leaveTypeSettingsUnparsed);

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

  if (!leaveType.needsManagerApproval) {
    let startDate = new Date(startDateAsString);
    const endDate = new Date(endDateAsString);
    while (startDate <= endDate) {
      await leave.create({
        pk: `${companyPk}/${userPk}`,
        sk: startDateAsString,
        type: leaveTypeName,
        leaveRequestPk: leaveRequest.pk,
        createdBy: userPk,
      });

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
