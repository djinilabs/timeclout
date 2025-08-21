import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import {
  CompanySettingsArgs,
  Leave,
  LeaveRequest,
  Query,
  QueryCompanyArgs,
  QueryTeamArgs,
  Team,
  TeamScheduleArgs,
} from "../../graphql/graphql";
import { useLocalPreference } from "../../hooks/useLocalPreference";
import { useQuery } from "../../hooks/useQuery";
import { leaveTypeColors , leaveTypeIcons } from "../../settings/leaveTypes";
import { TeamLeaveSchedule as TeamLeaveScheduleUI } from "../molecules/TeamLeaveSchedule";

import { DayDate } from "@/day-date";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import teamScheduleQuery from "@/graphql-client/queries/teamSchedule.graphql";
import { leaveTypeParser } from "@/settings";
import { getDefined } from "@/utils";


export const TeamLeaveSchedule = () => {
  const { team: teamId, company: companyId } = useParams();

  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(companyId, "No company provided"),
      name: "leaveTypes",
    },
  });

  const companyLeaveSettings = useMemo(
    () =>
      companyWithSettingsQueryResponse?.data?.company?.settings
        ? Object.fromEntries(
            leaveTypeParser
              .parse(companyWithSettingsQueryResponse.data.company.settings)
              .map((leaveType) => [leaveType.name, leaveType])
          )
        : undefined,
    [companyWithSettingsQueryResponse]
  );

  const [dateAsString, setDateAsString] = useLocalPreference(
    "team-leave-schedule-date-2",
    new DayDate(new Date()).firstOfMonth().toString()
  );

  const date = useMemo(() => new DayDate(dateAsString), [dateAsString]);

  const [teamScheduleResponse] = useQuery<
    { team: Team },
    TeamScheduleArgs & QueryTeamArgs
  >({
    query: teamScheduleQuery,
    variables: {
      teamPk: getDefined(teamId),
      startDate: date.toString(),
      endDate: date.endOfMonth().toString(),
    },
  });

  const formatLeaves = useCallback(
    (leaves: Leave[], leaveRequests: LeaveRequest[]) => {
      const leaveRequestsMap = Object.fromEntries(
        leaveRequests.map((lr) => [`${lr.pk}/${lr.sk}`, lr])
      );
      return Object.fromEntries(
        leaves.map((leave) => {
          const leaveRequest =
            leaveRequestsMap[`${leave.leaveRequestPk}/${leave.leaveRequestSk}`];
          const leaveType = companyLeaveSettings?.[leave.type];
          return [
            leave.sk,
            {
              type: leave.type,
              icon: leaveType && leaveTypeIcons[leaveType.icon],
              color: leaveType && leaveTypeColors[leaveType.color],
              leaveRequest,
            },
          ];
        })
      );
    },
    [companyLeaveSettings]
  );

  const schedule = teamScheduleResponse.data?.team?.schedule.userSchedules.map(
    (userSchedule) => ({
      user: userSchedule.user,
      leaves: formatLeaves(userSchedule.leaves, userSchedule.leaveRequests),
    })
  );

  return (
    <TeamLeaveScheduleUI
      year={date.getYear()}
      month={date.getMonth() - 1}
      goTo={useCallback(
        (year, month) => {
          const d = new Date();
          d.setUTCFullYear(year);
          d.setUTCMonth(month);
          d.setUTCDate(1);
          setDateAsString(new DayDate(d).toString());
        },
        [setDateAsString]
      )}
      schedule={schedule}
    />
  );
};
