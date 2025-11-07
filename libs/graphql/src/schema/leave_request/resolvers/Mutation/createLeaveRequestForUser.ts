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



export const createLeaveRequestForUser: NonNullable<MutationResolvers['createLeaveRequestForUser']> = async (_parent, { input }, ctx) => {
  const companyResourceRef = resourceRef("companies", input.companyPk);
  const actingUserPk = await ensureAuthorized(
    ctx,
    companyResourceRef,
    PERMISSION_LEVELS.READ
  );
  const teamResourceRef = resourceRef("teams", input.teamPk);
  await ensureAuthorized(ctx, teamResourceRef, PERMISSION_LEVELS.READ);

  // ensure user belongs to team
  const beneficiaryRef = resourceRef("users", input.beneficiaryPk);
  const [isAuthorized] = await isUserAuthorized(
    beneficiaryRef,
    teamResourceRef,
    PERMISSION_LEVELS.READ
  );
  if (!isAuthorized) {
    throw forbidden("User is not in the specified team");
  }
  return createLeaveRequestLogic({
    companyPk: companyResourceRef,
    userPk: beneficiaryRef,
    leaveTypeName: input.type,
    startDateAsString: input.startDate,
    endDateAsString: input.endDate,
    reason: input.reason,
    actingUserPk,
  }) as unknown as Promise<LeaveRequest>;
};
