import { useQuery } from "../hooks/useQuery";
import teamApprovedScheduleQuery from "@/graphql-client/queries/teamApprovedSchedule.graphql";
import { Team } from "../graphql/graphql";
import { getDefined } from "@/utils";
import { DayDate } from "@/day-date";
import { ReactNode, useMemo } from "react";
import { useCompanyWithSettings } from "./useCompanyWithSettings";
import { leaveTypeColors, leaveTypeIcons } from "../settings/leaveTypes";

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
}

export const useTeamLeaveSchedule = ({
  company,
  team,
  calendarStartDay,
  calendarEndDay,
  pause,
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
    return schedule.userSchedules
      .map((userSchedule) => {
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
      .flat()
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
      .reduce(
        (acc, [sk, leave]) => {
          const existingLeaves = acc[sk] ?? [];
          acc[sk] = [...existingLeaves, leave];
          return acc;
        },
        {} as Record<string, LeaveRenderInfo[]>
      );
  }, [leaveTypesSettings, teamScheduleResult?.team.approvedSchedule]);

  return { leaveSchedule };
};
