import { getDefined, ResourceRef } from "@/utils";
import { getCompanyLeaveTypes, getLeaveRequestsForDateRange } from "..";
import { getEntitySettings } from "../entity/getEntitySettings";
import { LeaveType, LeaveTypes } from "@/settings";
import { LeaveRequestRecord } from "@/tables";
import { getLeaveQuotaPeriods, LeaveQuotaPeriod } from "./getLeaveQuotaPeriods";
import { getLeaveFulfilmentForPeriod } from "./getLeaveFulfilmentForPeriod";

export interface QuotaFulfilmentParams {
  companyRef: ResourceRef;
  userRef: ResourceRef;
  startDate: string;
  endDate: string;
}

export interface QuotaFulfilment {
  quota: number;
  quotaStartDate: string;
  quotaEndDate: string;
  approvedUsed: number;
  pendingApprovalUsed: number;
}

export const getQuotaFulfilment = async ({
  companyRef,
  userRef,
  startDate,
  endDate,
}: QuotaFulfilmentParams): Promise<QuotaFulfilment[]> => {
  const defaultYearlyQuota = getDefined(
    await getEntitySettings<"yearlyQuota">(companyRef, "yearlyQuota")
  );
  const userYearlyQuota = getDefined(
    await getEntitySettings<"yearlyUserQuotas">(userRef, "yearlyUserQuotas")
  );

  const getPeriodQuota = (period: LeaveQuotaPeriod) => {
    return userYearlyQuota[period.start] || defaultYearlyQuota.defaultQuota;
  };

  // calculate period start and end according to the default yearly quota reset month
  const resetMonth = defaultYearlyQuota.resetMonth;

  const quotaPeriods = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

  return Promise.all(
    quotaPeriods.map(async (period) => {
      const leaveFulfilment = await getLeaveFulfilmentForPeriod({
        companyRef,
        userRef,
        startDate: period.start,
        endDate: period.end,
      });
      return {
        quota: getPeriodQuota(period),
        quotaStartDate: period.start,
        quotaEndDate: period.end,
        ...leaveFulfilment,
      };
    })
  );
};
