import { forbidden, notFound } from "@hapi/boom";

import { requireSession } from "../../../../session/requireSession";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import {
  canApproveLeaveRequest,
  approveLeaveRequest as approveLeaveRequestLogic,
} from "@/business-logic";
import { database } from "@/tables";
import { getDefined, resourceRef } from "@/utils";



export const approveLeaveRequest: NonNullable<MutationResolvers['approveLeaveRequest']> = async (_parent, arg, ctx) => {
  // get company resource ref
  const session = await requireSession(ctx);
  if (!session.user) {
    throw forbidden();
  }
  const userPk = resourceRef("users", getDefined(session.user.id));

  const { pk, sk } = arg.input;

  // make sure user has permission to approve leave request
  if (!(await canApproveLeaveRequest(userPk, pk))) {
    throw forbidden();
  }
  const { leave_request } = await database();
  const leaveRequest = await leave_request.get(pk, sk);
  if (!leaveRequest) {
    throw notFound();
  }
  // approve leave request
  await approveLeaveRequestLogic(leaveRequest, userPk);
  return leaveRequest as unknown as LeaveRequest;
};
