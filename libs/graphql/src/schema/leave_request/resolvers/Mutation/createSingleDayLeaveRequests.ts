import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import { createLeaveRequestsForSingleDays } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";


export const createSingleDayLeaveRequests: NonNullable<MutationResolvers['createSingleDayLeaveRequests']> = async (_parent, { input }, context) => {
  const companyResourceReference = resourceRef("companies", input.companyPk);
  const userPk = await ensureAuthorized(
    context,
    companyResourceReference,
    PERMISSION_LEVELS.READ
  );

  return createLeaveRequestsForSingleDays({
    companyPk: companyResourceReference,
    userPk,
    leaveTypeName: input.type,
    datesAsStrings: input.days,
    reason: input.reason,
  }) as unknown as Promise<LeaveRequest>;
};
