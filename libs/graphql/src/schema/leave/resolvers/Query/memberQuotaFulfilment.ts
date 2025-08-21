import { forbidden } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { QueryResolvers } from "./../../../../types.generated";

import { getQuotaFulfilment, isUserAuthorized } from "@/business-logic";
import { DayDate } from "@/day-date";
import { i18n } from "@/locales";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const memberQuotaFulfilment: NonNullable<
  QueryResolvers["memberQuotaFulfilment"]
> = async (_parent, arg, ctx) => {
  const {
    companyPk,
    teamPk,
    userPk,
    startDate,
    endDate,
    simulatesLeave,
    simulatesLeaveType,
  } = arg;
  const companyRef = resourceRef("companies", companyPk);
  await ensureAuthorized(ctx, companyRef, PERMISSION_LEVELS.READ);
  const teamRef = resourceRef("teams", teamPk);
  await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);

  // make sure user is on the team
  const userRef = resourceRef("users", userPk);
  const [isAuthorized] = await isUserAuthorized(
    userRef,
    teamRef,
    PERMISSION_LEVELS.READ
  );
  if (!isAuthorized) {
    throw forbidden(i18n._("User is not in the specified team"));
  }

  const quotaFulfilment = await getQuotaFulfilment({
    companyRef,
    userRef,
    startDate: new DayDate(startDate),
    endDate: new DayDate(endDate),
    simulatesLeave: simulatesLeave ?? undefined,
    simulatesLeaveType: simulatesLeaveType ?? undefined,
  });

  return quotaFulfilment.map((quota) => ({
    ...quota,
    quotaStartDate: quota.quotaStartDate.toString(),
    quotaEndDate: quota.quotaEndDate.toString(),
    simulatedStartDate: quota.simulatedStartDate?.toString(),
    simulatedEndDate: quota.simulatedEndDate?.toString(),
  }));
};
