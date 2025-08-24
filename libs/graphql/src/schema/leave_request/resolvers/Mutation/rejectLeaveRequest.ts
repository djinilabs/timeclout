import { notFound, forbidden } from "@hapi/boom";

import { requireSessionUser } from "../../../../session/requireSessionUser";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import {
  canApproveLeaveRequest,
  rejectLeaveRequest as rejectLeaveRequestLogic,
} from "@/business-logic";
import { i18n } from "@/locales";
import { database } from "@/tables";
import { getResourceRef } from "@/utils";




export const rejectLeaveRequest: NonNullable<
  MutationResolvers["rejectLeaveRequest"]
> = async (_parent, argument, context) => {
  const user = await requireSessionUser(context);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(argument.input.pk, argument.input.sk);
  if (!leaveRequest) {
    throw notFound(i18n._("Leave request not found"));
  }
  if (
    leaveRequest.createdBy !== user.pk &&
    !(await canApproveLeaveRequest(getResourceRef(user.pk), leaveRequest.pk))
  ) {
    throw forbidden(i18n._("You are not allowed to reject this leave request"));
  }
  await rejectLeaveRequestLogic(leaveRequest, user);
  return leaveRequest as unknown as LeaveRequest;
};
