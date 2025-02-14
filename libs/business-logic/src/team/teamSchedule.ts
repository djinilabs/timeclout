import { database } from "@/tables";
import { getDefined, ResourceRef } from "@/utils";
import { teamMembers } from "./teamMembers";
import { DayDate } from "@/day-date";
import { getLeavesForDateRange } from "../leave/getLeavesForDateRange";
import { getLeaveRequestsForDateRange } from "../leaveRequest/getLeaveRequestsForDateRange";

export interface TeamScheduleOptions {
  approved?: boolean;
}

export const teamSchedule = async (
  companyRef: ResourceRef<"companies">,
  teamRef: ResourceRef<"teams">,
  startDate: DayDate,
  endDate: DayDate,
  options?: TeamScheduleOptions
) => {
  const { entity } = await database();
  const memberRefs = await teamMembers(teamRef);
  const userSchedules = await Promise.all(
    memberRefs.map(async (memberRef) => {
      const leaves = await getLeavesForDateRange(
        companyRef,
        memberRef,
        startDate,
        endDate
      );
      const leaveRequests = await getLeaveRequestsForDateRange(
        companyRef,
        memberRef,
        startDate,
        endDate,
        options
      );
      return {
        user: await entity.get(memberRef),
        startDate,
        endDate,
        leaves,
        leaveRequests,
      };
    })
  );

  return {
    team: getDefined(await entity.get(teamRef)),
    startDate,
    endDate,
    userSchedules: userSchedules.sort(
      (a, b) => (b.user?.name && a.user?.name.localeCompare(b.user?.name)) || 0
    ),
  };
};
