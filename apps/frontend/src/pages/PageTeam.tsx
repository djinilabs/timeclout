import { useMemo, useState } from "react";
import { i18n } from "@lingui/core";
import { type Tab, Tabs } from "../components/stateless/Tabs";
import { TeamMembers } from "../components/TeamMembers";
import { TeamInvites } from "../components/TeamInvites";
import { TeamLeaveSchedule } from "../components/TeamLeaveSchedule";
import { Suspense } from "../components/stateless/Suspense";
import { TeamShiftsSchedule } from "../components/TeamShiftsSchedule";
import { TeamSettings } from "../components/TeamSettings";
import { useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryTeamArgs } from "../graphql/graphql";
import teamQuery from "@/graphql-client/queries/teamQuery.graphql";
import { TeamCalendarIntegrations } from "../components/TeamCalendarIntegrations";

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
