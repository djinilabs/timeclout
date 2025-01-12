import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";
import { database, PERMISSION_LEVELS, resourceRef } from "@/tables";
import { eventBus } from "@/event-bus";
import { notFound } from "@hapi/boom";
import { leaveTypesSchema } from "@/settings";

export const createLeaveRequest: NonNullable<
  MutationResolvers["createLeaveRequest"]
> = async (_parent, arg, ctx) => {
  const companyResourceRef = resourceRef("companies", arg.input.companyPk);
  const userPk = await ensureAuthorized(
    ctx,
    companyResourceRef,
    PERMISSION_LEVELS.READ
  );

  const { leave_request, entity_settings } = await database();

  const leaveTypeSettingsUnparsed = await entity_settings.get(
    companyResourceRef,
    "leaveTypes"
  );

  if (!leaveTypeSettingsUnparsed) {
    throw notFound("Company leave type settings not found");
  }

  const leaveTypeSettings = leaveTypesSchema.parse(leaveTypeSettingsUnparsed);

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
  })) as LeaveRequest;

  await eventBus().emit({
    key: "createLeaveRequest",
    value: {
      leaveRequest,
    },
  });

  return leaveRequest;
};
