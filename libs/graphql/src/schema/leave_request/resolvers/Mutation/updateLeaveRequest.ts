import { forbidden, notFound } from "@hapi/boom";

import { requireSession } from "../../../../session/requireSession";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import {
  canApproveLeaveRequest,
  updateLeaveRequest as updateLeaveRequestLogic,
} from "@/business-logic";
import { i18n } from "@/locales";
import { database } from "@/tables";
import { getDefined, resourceRef } from "@/utils";

export const updateLeaveRequest: NonNullable<
  MutationResolvers["updateLeaveRequest"]
> = async (_parent, argument, context) => {
  const session = await requireSession(context);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(argument.input.pk, argument.input.sk);
  if (!leaveRequest) {
    throw notFound(i18n._("Leave request not found"));
  }
  const userPk = resourceRef("users", getDefined(session.user?.id));
  if (
    leaveRequest.createdBy !== userPk ||
    !canApproveLeaveRequest(userPk, leaveRequest.pk)
  ) {
    throw forbidden(i18n._("You are not allowed to update this leave request"));
  }
  return updateLeaveRequestLogic({
    leaveRequest,
    userPk,
    leaveTypeName: argument.input.type,
    startDateAsString: argument.input.startDate,
    endDateAsString: argument.input.endDate,
    reason: argument.input.reason,
  }) as unknown as Promise<LeaveRequest>;
};
