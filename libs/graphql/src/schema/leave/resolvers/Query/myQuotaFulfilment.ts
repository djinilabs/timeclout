import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { QueryResolvers } from "./../../../../types.generated";

import { getQuotaFulfilment } from "@/business-logic";
import { DayDate } from "@/day-date";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const myQuotaFulfilment: NonNullable<QueryResolvers['myQuotaFulfilment']> = async (_parent, arg, ctx) => {
  const { companyPk, startDate, endDate, simulatesLeave, simulatesLeaveType } =
    arg;
  const companyRef = resourceRef("companies", companyPk);
  const userRef = await ensureAuthorized(
    ctx,
    companyRef,
    PERMISSION_LEVELS.READ
  );

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
