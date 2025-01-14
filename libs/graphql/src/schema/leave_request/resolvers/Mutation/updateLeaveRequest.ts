import { forbidden, notFound } from "@hapi/boom";
import { getDefined, resourceRef } from "@/utils";
import { database } from "@/tables";
import {
  canApproveLeaveRequest,
  updateLeaveRequest as updateLeaveRequestLogic,
} from "@/business-logic";
import type { MutationResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const updateLeaveRequest: NonNullable<MutationResolvers['updateLeaveRequest']> = async (_parent, arg, ctx) => {
  const session = await requireSession(ctx);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(arg.input.pk, arg.input.sk);
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
  return updateLeaveRequestLogic({
    leaveRequest,
    userPk,
    leaveTypeName: arg.input.type,
    startDateAsString: arg.input.startDate,
    endDateAsString: arg.input.endDate,
    reason: arg.input.reason,
  });
};
