import { forbidden, notFound } from "@hapi/boom";
import { getDefined, resourceRef } from "@/utils";
import { database } from "@/tables";
import {
  canApproveLeaveRequest,
  updateLeaveRequest as updateLeaveRequestLogic,
} from "@/business-logic";
import type { QueryResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const leaveRequest: NonNullable<QueryResolvers['leaveRequest']> = async (
  _parent,
  arg,
  ctx
) => {
  const session = await requireSession(ctx);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(arg.pk, arg.sk);
  if (!leaveRequest) {
    throw notFound("Leave request not found");
  }
  const userPk = resourceRef("users", getDefined(session.user?.id));
  if (
    leaveRequest.createdBy !== userPk ||
    !canApproveLeaveRequest(userPk, leaveRequest.pk)
  ) {
    throw forbidden("You are not allowed to update this leave request");
  }
  return leaveRequest;
};
