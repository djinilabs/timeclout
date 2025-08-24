import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import { createLeaveRequest as createLeaveRequestLogic } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";


export const createLeaveRequest: NonNullable<MutationResolvers['createLeaveRequest']> = async (_parent, argument, context) => {
  const companyResourceReference = resourceRef("companies", argument.input.companyPk);
  const userPk = await ensureAuthorized(
    context,
    companyResourceReference,
    PERMISSION_LEVELS.READ
  );

  return createLeaveRequestLogic({
    companyPk: companyResourceReference,
    userPk,
    leaveTypeName: argument.input.type,
    startDateAsString: argument.input.startDate,
    endDateAsString: argument.input.endDate,
    reason: argument.input.reason,
  }) as unknown as Promise<LeaveRequest>;
};
