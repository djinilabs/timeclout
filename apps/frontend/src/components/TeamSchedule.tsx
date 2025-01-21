import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import teamScheduleQuery from "@/graphql-client/queries/teamSchedule.graphql";
import { company } from "@/graphql-client/queries/companyQuery.graphql";
import { getDefined } from "@/utils";
import { DayDate } from "@/day-date";
import { useQuery } from "../hooks/useQuery";
import {
  CompanySettingsArgs,
  Leave,
  LeaveRequest,
  Query,
  QueryCompanyArgs,
  QueryTeamArgs,
  Team,
  TeamScheduleArgs,
} from "../graphql/graphql";
import { MonthlySchedule } from "./MonthlySchedule";
import { leaveTypeParser } from "@/settings";
import { leaveTypeColors } from "../settings/leaveTypes";
import { leaveTypeIcons } from "../settings/leaveTypes";

export const TeamSchedule = () => {
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

  const [date, setDate] = useState(new DayDate(new Date()).firstOfMonth());

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
    <MonthlySchedule
      year={date.getYear()}
      month={date.getMonth() - 1}
      goTo={useCallback((year, month) => {
        const d = new Date();
        d.setUTCFullYear(year);
        d.setUTCMonth(month);
        d.setUTCDate(1);
        setDate(new DayDate(d));
      }, [])}
      schedule={schedule}
    />
  );
};
