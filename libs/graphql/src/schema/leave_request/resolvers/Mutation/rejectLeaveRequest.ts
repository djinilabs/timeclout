import { database } from "@/tables";
import { notFound, forbidden } from "@hapi/boom";
import { getResourceRef } from "@/utils";
import {
  canApproveLeaveRequest,
  rejectLeaveRequest as rejectLeaveRequestLogic,
} from "@/business-logic";
import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";
import { i18n } from "@/locales";
import { requireSessionUser } from "../../../../session/requireSessionUser";

export const rejectLeaveRequest: NonNullable<
  MutationResolvers["rejectLeaveRequest"]
> = async (_parent, arg, ctx) => {
  const user = await requireSessionUser(ctx);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(arg.input.pk, arg.input.sk);
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
