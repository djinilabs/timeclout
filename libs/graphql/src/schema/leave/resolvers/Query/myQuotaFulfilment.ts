import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { QueryResolvers } from "./../../../../types.generated";

import { getQuotaFulfilment } from "@/business-logic";
import { DayDate } from "@/day-date";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const myQuotaFulfilment: NonNullable<QueryResolvers['myQuotaFulfilment']> = async (_parent, argument, context) => {
  const { companyPk, startDate, endDate, simulatesLeave, simulatesLeaveType } =
    argument;
  const companyReference = resourceRef("companies", companyPk);
  const userReference = await ensureAuthorized(
    context,
    companyReference,
    PERMISSION_LEVELS.READ
  );

  const quotaFulfilment = await getQuotaFulfilment({
    companyRef: companyReference,
    userRef: userReference,
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
