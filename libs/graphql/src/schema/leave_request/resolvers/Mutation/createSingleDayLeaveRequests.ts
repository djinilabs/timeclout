import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import { createLeaveRequestsForSingleDays } from "@/business-logic";
import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const createSingleDayLeaveRequests: NonNullable<MutationResolvers['createSingleDayLeaveRequests']> = async (_parent, { input }, ctx) => {
  const companyResourceRef = resourceRef("companies", input.companyPk);
  const userPk = await ensureAuthorized(
    ctx,
    companyResourceRef,
    PERMISSION_LEVELS.READ
  );

  return createLeaveRequestsForSingleDays({
    companyPk: companyResourceRef,
    userPk,
    leaveTypeName: input.type,
    datesAsStrings: input.days,
    reason: input.reason,
  }) as unknown as Promise<LeaveRequest>;
};
