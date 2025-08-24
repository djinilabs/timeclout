import { getLeavesForDateRange } from "../leave/getLeavesForDateRange";
import { getLeaveRequestsForDateRange } from "../leaveRequest/getLeaveRequestsForDateRange";

import { teamMembers } from "./teamMembers";

import { DayDate } from "@/day-date";
import { database } from "@/tables";
import { getDefined, ResourceRef } from "@/utils";


export interface TeamScheduleOptions {
  approved?: boolean;
}

export const teamSchedule = async (
  companyReference: ResourceRef<"companies">,
  teamReference: ResourceRef<"teams">,
  startDate: DayDate,
  endDate: DayDate,
  options?: TeamScheduleOptions
) => {
  const { entity } = await database();
  const memberReferences = await teamMembers(teamReference);
  const userSchedules = await Promise.all(
    memberReferences.map(async (memberReference) => {
      const leaves = await getLeavesForDateRange(
        companyReference,
        memberReference,
        startDate,
        endDate
      );
      const leaveRequests = await getLeaveRequestsForDateRange(
        companyReference,
        memberReference,
        startDate,
        endDate,
        options
      );
      return {
        user: await entity.get(memberReference),
        startDate,
        endDate,
        leaves,
        leaveRequests,
      };
    })
  );

  return {
    team: getDefined(await entity.get(teamReference)),
    startDate,
    endDate,
    userSchedules: userSchedules
      .filter((userSchedule) => userSchedule.user)
      .sort((a, b) =>
        a.user?.name && b.user?.name
          ? a.user?.name.localeCompare(b.user?.name)
          : 0
      ),
  };
};
