import { forbidden } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  LeaveRequest,
  MutationResolvers,
} from "./../../../../types.generated";

import {
  createLeaveRequestsForSingleDays,
  isUserAuthorized,
} from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const createSingleDayLeaveRequestsForUser: NonNullable<MutationResolvers['createSingleDayLeaveRequestsForUser']> = async (_parent, { input }, ctx) => {
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
  return createLeaveRequestsForSingleDays({
    companyPk: companyResourceRef,
    userPk: beneficiaryRef,
    leaveTypeName: input.type,
    datesAsStrings: input.dates,
    reason: input.reason,
    actingUserPk,
  }) as unknown as Promise<LeaveRequest[]>;
};
