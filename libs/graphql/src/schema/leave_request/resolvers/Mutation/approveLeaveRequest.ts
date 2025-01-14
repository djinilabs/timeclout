import { requireSession } from "libs/graphql/src/session/requireSession";
import type { MutationResolvers } from "./../../../../types.generated";
import {
  canApproveLeaveRequest,
  approveLeaveRequest as approveLeaveRequestLogic,
} from "@/business-logic";
import { forbidden, notFound } from "@hapi/boom";
import { database } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
export const approveLeaveRequest: NonNullable<
  MutationResolvers["approveLeaveRequest"]
> = async (_parent, arg, ctx) => {
  // get company resource ref
  const user = await requireSession(ctx);
  if (!user.user) {
    throw forbidden();
  }
  const userPk = resourceRef("users", getDefined(user.user.id));

  // make sure user has permission to approve leave request
  if (!(await canApproveLeaveRequest(userPk, arg.input.pk))) {
    throw forbidden();
  }
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(arg.input.pk);
  if (!leaveRequest) {
    throw notFound();
  }
  // approve leave request
  return approveLeaveRequestLogic(leaveRequest, userPk);
};
