import { database } from "libs/tables/src/database";
import { resourceRef } from "@/utils";
import { PERMISSION_LEVELS } from "@/tables";
import type {
  Leave,
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { getLeaveRequestsForDateRange } from "@/business-logic";
import { getLeavesForDateRange } from "libs/business-logic/src/leave/getLeavesForDateRange";

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
    firstDayOfFirstWeek.toISOString().split("T")[0],
    lastDayOfLastWeek.toISOString().split("T")[0]
  );

  const leaves = await getLeavesForDateRange(
    companyRef,
    userRef,
    firstDayOfFirstWeek.toISOString().split("T")[0],
    lastDayOfLastWeek.toISOString().split("T")[0]
  );

  return {
    year,
    leaves: leaves as Leave[],
    leaveRequests: leaveRequests as unknown as LeaveRequest[],
  };
};
