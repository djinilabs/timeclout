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

export interface UseTeamLeaveScheduleParameters {
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
}: UseTeamLeaveScheduleParameters): {
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
    return schedule.userSchedules
      .filter(
        (userSchedule) =>
          restrictToUsers?.some((user) => user.pk === userSchedule.user.pk) ??
          true
      )
      .flatMap((userSchedule) => {
        return userSchedule.leaves.map((leave): [string, LeaveInfo] => {
          return [
            leave.sk,
            {
              type: leave.type,
              user: userSchedule.user,
            },
          ];
        });
      })
      .map(([sk, leave]): [string, LeaveRenderInfo] => {
        return [
          sk,
          {
            ...leave,
            icon: leaveTypeIcons[
              getDefined(
                leaveTypesSettings.find((type) => type.name === leave.type)
              ).icon
            ],
            color:
              leaveTypeColors[
                getDefined(
                  leaveTypesSettings.find((type) => type.name === leave.type)
                ).color
              ],
          },
        ];
      })
      .reduce((accumulator, [sk, leave]) => {
        const existingLeaves = accumulator[sk] ?? [];
        accumulator[sk] = [...existingLeaves, leave];
        return accumulator;
      }, {} as Record<string, LeaveRenderInfo[]>);
  }, [
    leaveTypesSettings,
    restrictToUsers,
    teamScheduleResult?.team.approvedSchedule,
  ]);

  return { leaveSchedule };
};
