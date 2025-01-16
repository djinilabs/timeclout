import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import { createLeaveRequest as createLeaveRequestLogic } from "@/business-logic";
import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const createLeaveRequest: NonNullable<MutationResolvers['createLeaveRequest']> = async (_parent, arg, ctx) => {
  const companyResourceRef = resourceRef("companies", arg.input.companyPk);
  const userPk = await ensureAuthorized(
    ctx,
    companyResourceRef,
    PERMISSION_LEVELS.READ
  );

  return createLeaveRequestLogic({
    companyPk: companyResourceRef,
    userPk,
    leaveTypeName: arg.input.type,
    startDateAsString: arg.input.startDate,
    endDateAsString: arg.input.endDate,
    reason: arg.input.reason,
  }) as unknown as Promise<LeaveRequest>;
};
