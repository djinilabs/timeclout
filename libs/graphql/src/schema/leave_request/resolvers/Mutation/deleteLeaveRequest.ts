import { forbidden, notFound } from "@hapi/boom";

import { requireSession } from "../../../../session/requireSession";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import { canApproveLeaveRequest, removeLeaveRequest } from "@/business-logic";
import { database } from "@/tables";
import { getDefined, resourceRef } from "@/utils";

export const deleteLeaveRequest: NonNullable<MutationResolvers['deleteLeaveRequest']> = async (_parent, argument, context) => {
  const session = await requireSession(context);
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(argument.input.pk, argument.input.sk);
  if (!leaveRequest) {
    throw notFound("Leave request not found");
  }
  const userPk = resourceRef("users", getDefined(session.user?.id));
  if (
    leaveRequest.createdBy !== userPk &&
    (await canApproveLeaveRequest(userPk, leaveRequest.pk))
  ) {
    throw forbidden("You are not allowed to delete this leave request");
  }
  await removeLeaveRequest({
    pk: leaveRequest.pk,
    sk: leaveRequest.sk,
  });
  return leaveRequest as unknown as LeaveRequest;
};
