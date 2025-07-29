import { forbidden, notFound } from "@hapi/boom";
import { getDefined, resourceRef } from "@/utils";
import { database } from "@/tables";
import { canApproveLeaveRequest } from "@/business-logic";
import type {
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { i18n } from "@/locales";

export const leaveRequest: NonNullable<QueryResolvers["leaveRequest"]> = async (
  _parent,
  arg,
  ctx
) => {
  const session = await requireSession(ctx);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(arg.pk, arg.sk);
  if (!leaveRequest) {
    throw notFound(i18n._("Leave request not found"));
  }
  const userPk = resourceRef("users", getDefined(session.user?.id));
  if (
    leaveRequest.createdBy !== userPk &&
    !(await canApproveLeaveRequest(userPk, leaveRequest.pk))
  ) {
    throw forbidden(i18n._("You are not allowed to update this leave request"));
  }
  return leaveRequest as unknown as LeaveRequest;
};
