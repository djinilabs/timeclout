import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  Leave,
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";

import {
  getLeaveRequestsForDateRange,
  getLeavesForDateRange,
} from "@/business-logic";
import { DayDate } from "@/day-date";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const myLeaveCalendar: NonNullable<QueryResolvers['myLeaveCalendar']> = async (_parent, argument, context) => {
  const { companyPk, year } = argument;
  const companyReference = resourceRef("companies", companyPk);
  const userReference = await ensureAuthorized(
    context,
    companyReference,
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
    companyReference,
    userReference,
    new DayDate(firstDayOfFirstWeek),
    new DayDate(lastDayOfLastWeek)
  );

  const leaves = await getLeavesForDateRange(
    companyReference,
    userReference,
    new DayDate(firstDayOfFirstWeek),
    new DayDate(lastDayOfLastWeek)
  );

  return {
    year,
    leaves: leaves as Leave[],
    leaveRequests: leaveRequests as unknown as LeaveRequest[],
  };
};
