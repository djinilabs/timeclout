import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { i18n } from "@lingui/core";
import { getDefined } from "@/utils";
import teamQuery from "@/graphql-client/queries/teamQuery.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryTeamArgs } from "../graphql/graphql";
import { Suspense } from "../components/atoms/Suspense";
import { type Tab, Tabs } from "../components/molecules/Tabs";
import { TeamSettings } from "../components/team/TeamSettings";
import { TeamMembers } from "../components/team/TeamMembers";
import { TeamInvites } from "../components/team/TeamInvites";
import { TeamLeaveSchedule } from "../components/team/TeamLeaveSchedule";
import { TeamShiftsSchedule } from "../components/team/TeamShiftsSchedule";
import { TeamCalendarIntegrations } from "../components/team/TeamCalendarIntegrations";

export const PageTeam = () => {
  const { team: teamPk } = useParams();
  const [queryResponse] = useQuery<{ team: Query["team"] }, QueryTeamArgs>({
    query: teamQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
    },
  });
  const team = queryResponse.data?.team;
  const tabs = useMemo<Tab[]>(
    () => [
      ...((team?.resourcePermission ?? -1) >= 2
        ? [{ name: i18n.t("Members"), href: "members" }]
        : []),
      { name: i18n.t("Leave Schedule"), href: "leave-schedule" },
      { name: i18n.t("Shifts Calendar"), href: "shifts-calendar" },
      ...((team?.resourcePermission ?? -1) >= 2 // WRITE
        ? [
            { name: i18n.t("Invitations"), href: "invitations" },
            { name: i18n.t("Settings"), href: "settings" },
          ]
        : []),
      { name: i18n.t("Calendar integrations"), href: "calendar-integrations" },
    ],
    [team?.resourcePermission]
  );
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <Suspense>
      <div>
        <Tabs
          tabs={tabs}
          onChange={setCurrentTab}
          className="team-header team-invite-button leave-requests-section"
        >
          {currentTab.href === "members" && <TeamMembers />}
          {currentTab.href === "invitations" && <TeamInvites />}
          {currentTab.href === "leave-schedule" && <TeamLeaveSchedule />}
          {currentTab.href === "shifts-calendar" && <TeamShiftsSchedule />}
          {currentTab.href === "settings" && <TeamSettings />}
          {currentTab.href === "calendar-integrations" && (
            <TeamCalendarIntegrations />
          )}
        </Tabs>
      </div>
    </Suspense>
  );
};
