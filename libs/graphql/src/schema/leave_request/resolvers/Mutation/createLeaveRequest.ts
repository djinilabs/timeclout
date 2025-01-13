import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";
import { database, PERMISSION_LEVELS, resourceRef } from "@/tables";
import { eventBus } from "@/event-bus";
import { notFound } from "@hapi/boom";
import { leaveTypeParser } from "@/settings";

export const createLeaveRequest: NonNullable<
  MutationResolvers["createLeaveRequest"]
> = async (_parent, arg, ctx) => {
  const companyResourceRef = resourceRef("companies", arg.input.companyPk);
  const userPk = await ensureAuthorized(
    ctx,
    companyResourceRef,
    PERMISSION_LEVELS.READ
  );

  const { leave_request, entity_settings, leave } = await database();

  const leaveTypeSettingsUnparsed = await entity_settings.get(
    companyResourceRef,
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
    (type) => type.name === arg.input.type
  );

  if (!leaveType) {
    throw notFound("Leave type not found");
  }

  const leaveRequest = (await leave_request.create({
    pk: `${companyResourceRef}/${userPk}`,
    sk: `${arg.input.startDate}/${arg.input.endDate}/${arg.input.type}`,
    type: arg.input.type,
    startDate: arg.input.startDate,
    endDate: arg.input.endDate,
    reason: arg.input.reason,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    approved: !leaveType.needsManagerApproval,
    approvedBy: leaveType.needsManagerApproval ? [] : [userPk],
    approvedAt: leaveType.needsManagerApproval
      ? []
      : [new Date().toISOString()],
  })) as LeaveRequest;

  if (!leaveType.needsManagerApproval) {
    let startDate = arg.input.startDate;
    const endDate = new Date(arg.input.endDate);
    while (new Date(startDate) <= endDate) {
      await leave.create({
        pk: `${companyResourceRef}/${userPk}`,
        sk: startDate,
        type: arg.input.type,
        leaveRequestPk: leaveRequest.pk,
        createdBy: userPk,
        createdAt: new Date().toISOString(),
      });

      // Move to next day
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 1);
      startDate = nextDate.toISOString().split("T")[0];
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
