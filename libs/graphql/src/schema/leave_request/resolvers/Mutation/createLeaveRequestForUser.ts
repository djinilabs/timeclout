import { forbidden } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import {
  createLeaveRequest as createLeaveRequestLogic,
  isUserAuthorized,
} from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const createLeaveRequestForUser: NonNullable<MutationResolvers['createLeaveRequestForUser']> = async (_parent, { input }, context) => {
  const companyResourceReference = resourceRef("companies", input.companyPk);
  const actingUserPk = await ensureAuthorized(
    context,
    companyResourceReference,
    PERMISSION_LEVELS.READ
  );
  const teamResourceReference = resourceRef("teams", input.teamPk);
  await ensureAuthorized(context, teamResourceReference, PERMISSION_LEVELS.READ);

  // ensure user belongs to team
  const beneficiaryReference = resourceRef("users", input.beneficiaryPk);
  const [isAuthorized] = await isUserAuthorized(
    beneficiaryReference,
    teamResourceReference,
    PERMISSION_LEVELS.READ
  );
  if (!isAuthorized) {
    throw forbidden("User is not in the specified team");
  }
  return createLeaveRequestLogic({
    companyPk: companyResourceReference,
    userPk: beneficiaryReference,
    leaveTypeName: input.type,
    startDateAsString: input.startDate,
    endDateAsString: input.endDate,
    reason: input.reason,
    actingUserPk,
  }) as unknown as Promise<LeaveRequest>;
};
