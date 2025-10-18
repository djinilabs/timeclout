import { ReactNode, useMemo } from "react";

import { Team, User } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { leaveTypeColors, leaveTypeIcons } from "../settings/leaveTypes";

import { useCompanyWithSettings } from "./useCompanyWithSettings";

import { DayDate } from "@/day-date";
import teamApprovedScheduleQuery from "@/graphql-client/queries/teamApprovedSchedule.graphql";
import { getDefined } from "@/utils";

interface LeaveInfo {
  type: string;
  user: {
    pk: string;
    name: string;
    email: string;
    emailMd5: string;
  };
}

export interface LeaveRenderInfo {
  type: string;
  user: {
    pk: string;
    name: string;
    email: string;
    emailMd5: string;
  };
  icon: ReactNode;
  color: string;
}

export interface UseTeamLeaveScheduleParams {
  company: string;
  team: string;
  calendarStartDay: DayDate;
  calendarEndDay: DayDate;
  pause?: boolean;
  restrictToUsers?: User[];
}

export const useTeamLeaveSchedule = ({
  company,
  team,
  calendarStartDay,
  calendarEndDay,
  pause,
  restrictToUsers,
}: UseTeamLeaveScheduleParams): {
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
} => {
  const { settings: leaveTypesSettings } = useCompanyWithSettings({
    companyPk: getDefined(company),
    settingsName: "leaveTypes",
  });

  const [{ data: teamScheduleLastResult }] = useQuery<{ team: Team }>({
    query: teamApprovedScheduleQuery,
    variables: {
      teamPk: getDefined(team),
      startDate: calendarStartDay.toString(),
      endDate: calendarEndDay.toString(),
    },
    pause,
  });

  const teamScheduleResult = teamScheduleLastResult;

  const leaveSchedule: Record<string, LeaveRenderInfo[]> = useMemo(() => {
    const schedule = teamScheduleResult?.team.approvedSchedule;
    if (!schedule || !leaveTypesSettings) {
      return {};
    }

    const result: Record<string, LeaveRenderInfo[]> = {};

    schedule.userSchedules
      .filter(
        (userSchedule) =>
          restrictToUsers?.some((user) => user.pk === userSchedule.user.pk) ??
          true
      )
      .forEach((userSchedule) => {
        // Create a map of leave requests for this user
        const leaveRequestsMap = new Map();
        userSchedule.leaveRequests.forEach((leaveRequest) => {
          leaveRequestsMap.set(
            `${leaveRequest.pk}/${leaveRequest.sk}`,
            leaveRequest
          );
        });

        userSchedule.leaves.forEach((leave) => {
          const leaveType = leaveTypesSettings.find(
            (type) => type.name === leave.type
          );
          if (!leaveType) {
            return;
          }

          // Find the corresponding leave request to get the date range
          const leaveRequest = leaveRequestsMap.get(
            `${leave.leaveRequestPk}/${leave.leaveRequestSk}`
          );
          if (!leaveRequest) {
            return;
          }

          const leaveRenderInfo: LeaveRenderInfo = {
            type: leave.type,
            user: userSchedule.user,
            icon: leaveTypeIcons[leaveType.icon],
            color: leaveTypeColors[leaveType.color],
          };

          // Generate all days in the leave request date range
          const startDate = new DayDate(leaveRequest.startDate);
          const endDate = new DayDate(leaveRequest.endDate);

          let currentDate = startDate;
          while (currentDate.isBeforeOrEqual(endDate)) {
            const dayKey = currentDate.toString();
            if (!result[dayKey]) {
              result[dayKey] = [];
            }

            // Check if this leave is already added for this day to avoid duplicates
            const existingLeave = result[dayKey].find(
              (existing) =>
                existing.user.pk === leaveRenderInfo.user.pk &&
                existing.type === leaveRenderInfo.type
            );

            if (!existingLeave) {
              result[dayKey].push(leaveRenderInfo);
            }

            currentDate = currentDate.nextDay();
          }
        });
      });

    return result;
  }, [
    leaveTypesSettings,
    restrictToUsers,
    teamScheduleResult?.team.approvedSchedule,
  ]);

  return { leaveSchedule };
};
