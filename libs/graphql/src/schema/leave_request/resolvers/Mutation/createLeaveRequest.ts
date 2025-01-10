import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";
import { database, PERMISSION_LEVELS, resourceRef } from "@/tables";

export const createLeaveRequest: NonNullable<
  MutationResolvers["createLeaveRequest"]
> = async (_parent, arg, ctx) => {
  const companyResourceRef = resourceRef("companies", arg.input.companyPk);
  const userPk = await ensureAuthorized(
    ctx,
    companyResourceRef,
    PERMISSION_LEVELS.READ
  );

  const { leave_request } = await database();

  const leaveRequest = await leave_request.create({
    pk: companyResourceRef,
    sk: arg.input.startDate,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    type: arg.input.type,
    endDate: arg.input.endDate,
  });

  await eventBus().emit("leave_request_created", {
    leaveRequest,
  });

  return leaveRequest as LeaveRequest;
};
