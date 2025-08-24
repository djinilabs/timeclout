import { getEntitySettings } from "../entity/getEntitySettings";

import { getLeaveFulfilmentForPeriod } from "./getLeaveFulfilmentForPeriod";
import { getLeaveQuotaPeriods } from "./getLeaveQuotaPeriods";

import { DayDate , DayDateInterval } from "@/day-date";
import { getDefined, ResourceRef } from "@/utils";

export interface SimulatedLeave {
  type: string;
  startDate: DayDate;
  endDate: DayDate;
}

export interface QuotaFulfilmentParameters {
  companyRef: ResourceRef<"companies">;
  userRef: ResourceRef<"users">;
  startDate: DayDate;
  endDate: DayDate;
  simulatesLeave?: boolean;
  simulatesLeaveType?: string;
}

export interface QuotaFulfilment {
  quota: number;
  quotaStartDate: DayDate;
  quotaEndDate: DayDate;
  approvedUsed: number;
  pendingApprovalUsed: number;
  simulatedUsed?: number;
  simulatedType?: string;
  simulatedStartDate?: DayDate;
  simulatedEndDate?: DayDate;
}

const simulatedLeaveForPeriod = (
  simulatesLeave: boolean | undefined,
  simulatesLeaveType: string | undefined,
  period: DayDateInterval,
  startDate: DayDate,
  endDate: DayDate
): SimulatedLeave | undefined => {
  if (!simulatesLeave) {
    return undefined;
  }
  const intercept = period.intersect(new DayDateInterval(startDate, endDate));
  return {
    type: getDefined(simulatesLeaveType),
    startDate: intercept.start,
    endDate: intercept.end,
  };
};

export const getQuotaFulfilment = async ({
  companyRef,
  userRef,
  startDate,
  endDate,
  simulatesLeave,
  simulatesLeaveType,
}: QuotaFulfilmentParameters): Promise<QuotaFulfilment[]> => {
  const defaultYearlyQuota = getDefined(
    await getEntitySettings<"yearlyQuota">(companyRef, "yearlyQuota"),
    "No yearly quota found in company settings"
  );
  const userYearlyQuota = await getEntitySettings<"yearlyUserQuotas">(
    userRef,
    "yearlyUserQuotas"
  );

  const getPeriodQuota = (period: DayDateInterval) => {
    return (
      userYearlyQuota?.find(
        (quota) => quota.startDate === period.start.toString()
      )?.quota || defaultYearlyQuota.defaultQuota
    );
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
        simulation: simulatedLeaveForPeriod(
          simulatesLeave,
          simulatesLeaveType,
          period,
          startDate,
          endDate
        ),
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
