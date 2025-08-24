import { getEntitySettings } from "../entity/getEntitySettings";
import { getHolidaysForDateRange } from "../holiday/getHolidaysForDateRange";
import { getLeaveRequestsForDateRange } from "../leaveRequest/getLeaveRequestsForDateRange";
import { getCompanyLeaveTypes } from "../leaveType/getCompanyLeaveTypes";

import { getLeavesForDateRange } from "./getLeavesForDateRange";

import { DayDate, DayDateInterval } from "@/day-date";
import { getDefined, ResourceRef } from "@/utils";



export interface SimulatedLeave {
  type: string;
  startDate: DayDate;
  endDate: DayDate;
}

export interface LeaveFulfilmentForPeriodParameters {
  companyRef: ResourceRef<"companies">;
  userRef: ResourceRef<"users">;
  startDate: DayDate;
  endDate: DayDate;
  simulation?: SimulatedLeave;
}

export interface SimulationResult {
  simulatedUsed?: number;
  simulatedType?: string;
  simulatedStartDate?: DayDate;
  simulatedEndDate?: DayDate;
}

export interface LeaveFulfilmentForPeriod extends SimulationResult {
  startDate: DayDate;
  endDate: DayDate;
  approvedUsed: number;
  pendingApprovalUsed: number;
}

export const getLeaveFulfilmentForPeriod = async ({
  companyRef,
  userRef,
  startDate,
  endDate,
  simulation,
}: LeaveFulfilmentForPeriodParameters): Promise<LeaveFulfilmentForPeriod> => {
  const leaveTypes = await getCompanyLeaveTypes(companyRef);
  const workSchedule = getDefined(
    await getEntitySettings<"workSchedule">(companyRef, "workSchedule")
  );

  const holidays = await getHolidaysForDateRange(userRef, startDate, endDate);

  const isWeekWorkDay = (date: DayDate) => {
    const day = date.getWeekDay();
    return workSchedule[day]?.isWorkDay;
  };

  const isHoliday = (date: DayDate) => {
    return Object.hasOwn(holidays, date.toString());
  };

  const isWorkDay = (date: DayDate) => {
    return isWeekWorkDay(date) && !isHoliday(date);
  };

  const leavesResult = await getLeavesForDateRange(companyRef, userRef, startDate, endDate);
  const approvedUsedLeaves = leavesResult.filter((leave) => leaveTypes[leave.type].deductsFromAnnualAllowance);

  const approvedUsed = approvedUsedLeaves.filter((leave) => {
    const holiday = holidays[leave.sk];
    if (holiday) {
      return false;
    }
    return true;
  }).length;

  const leaveRequestsResult = await getLeaveRequestsForDateRange(companyRef, userRef, startDate, endDate);
  const pendingApprovalLeaveRequests = leaveRequestsResult.filter(
    (leaveRequest) => leaveTypes[leaveRequest.type].deductsFromAnnualAllowance
  );

  const pendingApprovalUsed = pendingApprovalLeaveRequests.reduce(
    (accumulator, leaveRequest) => {
      const startDate = new DayDate(leaveRequest.startDate);
      const endDate = new DayDate(leaveRequest.endDate);
      for (
        let date = startDate;
        date.compareTo(endDate) <= 0;
        date = date.nextDay()
      ) {
        if (!isWorkDay(date)) {
          return accumulator;
        }
        accumulator++;
      }
      return accumulator;
    },
    0
  );

  const simulationResult: SimulationResult | undefined = simulation
    ? {
        simulatedUsed: new DayDateInterval(
          simulation.startDate,
          simulation.endDate
        )
          .getDays()
          .reduce((accumulator, day) => {
            if (!leaveTypes[simulation.type].deductsFromAnnualAllowance) {
              return accumulator;
            }
            const deducts = isWorkDay(day);
            console.log("deducts", deducts, day.toString());
            if (!deducts) {
              return accumulator;
            }
            return accumulator + 1;
          }, 0),
        simulatedType: simulation.type,
        simulatedStartDate: simulation.startDate,
        simulatedEndDate: simulation.endDate,
      }
    : undefined;

  return {
    startDate,
    endDate,
    approvedUsed,
    pendingApprovalUsed,
    ...simulationResult,
  };
};
