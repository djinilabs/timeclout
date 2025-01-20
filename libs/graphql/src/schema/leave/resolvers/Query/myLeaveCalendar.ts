import { resourceRef } from "@/utils";
import { PERMISSION_LEVELS } from "@/tables";
import {
  getLeaveRequestsForDateRange,
  getLeavesForDateRange,
} from "@/business-logic";
import { DayDate } from "@/day-date";
import type {
  Leave,
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const myLeaveCalendar: NonNullable<QueryResolvers['myLeaveCalendar']> = async (_parent, arg, ctx) => {
  const { companyPk, year } = arg;
  const companyRef = resourceRef("companies", companyPk);
  const userRef = await ensureAuthorized(
    ctx,
    companyRef,
    PERMISSION_LEVELS.READ
  );

  // get first day of the year and first day of first week
  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfFirstWeek = new Date(firstDayOfYear);
  firstDayOfFirstWeek.setDate(
    firstDayOfYear.getDate() - firstDayOfYear.getDay()
  );
  const lastDayOfYear = new Date(year, 11, 31);
  const lastDayOfLastWeek = new Date(lastDayOfYear);
  lastDayOfLastWeek.setDate(
    lastDayOfYear.getDate() + (6 - lastDayOfYear.getDay())
  );

  const leaveRequests = await getLeaveRequestsForDateRange(
    companyRef,
    userRef,
    new DayDate(firstDayOfFirstWeek),
    new DayDate(lastDayOfLastWeek)
  );

  const leaves = await getLeavesForDateRange(
    companyRef,
    userRef,
    new DayDate(firstDayOfFirstWeek),
    new DayDate(lastDayOfLastWeek)
  );

  return {
    year,
    leaves: leaves as Leave[],
    leaveRequests: leaveRequests as unknown as LeaveRequest[],
  };
};
