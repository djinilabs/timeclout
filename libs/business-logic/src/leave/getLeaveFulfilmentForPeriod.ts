import { ResourceRef } from "@/utils";
import { getLeaveRequestsForDateRange } from "../leaveRequest/getLeaveRequestsForDateRange";
import { getCompanyLeaveTypes } from "../leaveType/getCompanyLeaveTypes";
import { getLeavesForDateRange } from "./getLeavesForDateRange";

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

export const getLeaveFulfilmentForPeriod = async ({
  companyRef,
  userRef,
  startDate,
  endDate,
}: LeaveFulfilmentForPeriodParams): Promise<LeaveFulfilmentForPeriod> => {
  const leaveTypes = await getCompanyLeaveTypes(companyRef);

  const approvedUsed = (
    await getLeavesForDateRange(companyRef, userRef, startDate, endDate)
  ).filter((leave) => leaveTypes[leave.type].deductsFromAnnualAllowance).length;

  const pendingApprovalUsed = (
    await getLeaveRequestsForDateRange(companyRef, userRef, startDate, endDate)
  ).filter(
    (leaveRequest) => leaveTypes[leaveRequest.type].deductsFromAnnualAllowance
  ).length;

  return {
    startDate,
    endDate,
    approvedUsed,
    pendingApprovalUsed,
  };
};
