import { ResourceRef } from "@/utils";
import { getLeaveRequestsForDateRange } from "../leaveRequest/getLeaveRequestsForDateRange";
import { getCompanyLeaveTypes } from "../leaveType/getCompanyLeaveTypes";
import { getLeavesForDateRange } from "./getLeavesForDateRange";
import { getHolidaysForDateRange } from "../holiday/getHolidaysForDateRange";

export interface LeaveFulfilmentForPeriodParams {
  companyRef: ResourceRef;
  userRef: ResourceRef;
  startDate: string;
  endDate: string;
}

export interface LeaveFulfilmentForPeriod {
  startDate: string;
  endDate: string;
  approvedUsed: number;
  pendingApprovalUsed: number;
}

const createDayDate = (date: string) => {
  return new Date(date + "T00:00:00Z");
};

export const getLeaveFulfilmentForPeriod = async ({
  companyRef,
  userRef,
  startDate,
  endDate,
}: LeaveFulfilmentForPeriodParams): Promise<LeaveFulfilmentForPeriod> => {
  const leaveTypes = await getCompanyLeaveTypes(companyRef);

  const holidays = await getHolidaysForDateRange(userRef, startDate, endDate);

  const approvedUsedLeaves = (
    await getLeavesForDateRange(companyRef, userRef, startDate, endDate)
  ).filter((leave) => leaveTypes[leave.type].deductsFromAnnualAllowance);

  const approvedUsed = approvedUsedLeaves.filter((leave) => {
    const holiday = holidays[leave.sk];
    if (holiday) {
      return false;
    }
    return true;
  }).length;

  const pendingApprovalLeaveRequests = (
    await getLeaveRequestsForDateRange(companyRef, userRef, startDate, endDate)
  ).filter(
    (leaveRequest) => leaveTypes[leaveRequest.type].deductsFromAnnualAllowance
  );

  const pendingApprovalUsed = pendingApprovalLeaveRequests.reduce(
    (acc, leaveRequest) => {
      const startDate = createDayDate(leaveRequest.startDate);
      const endDate = createDayDate(leaveRequest.endDate);
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const holiday = holidays[date.toISOString().split("T")[0]];
        if (holiday) {
          return acc;
        }
        acc++;
      }
      return acc;
    },
    0
  );

  return {
    startDate,
    endDate,
    approvedUsed,
    pendingApprovalUsed,
  };
};
