import { useMemo, useState } from "react";
import { i18n } from "@lingui/core";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { type Tab, Tabs } from "../components/stateless/Tabs";
import { TeamMembers } from "../components/TeamMembers";
import { TeamInvites } from "../components/TeamInvites";
import { TeamLeaveSchedule } from "../components/TeamLeaveSchedule";
import { Suspense } from "../components/stateless/Suspense";
import { TeamShiftsCalendar } from "../components/TeamShiftsCalendar";
import { TeamSettings } from "../components/TeamSettings";
import { useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryTeamArgs } from "../graphql/graphql";
import teamQuery from "@/graphql-client/queries/teamQuery.graphql";

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
      { name: i18n.t("Leave Schedule"), href: "leave-schedule" },
      { name: i18n.t("Shifts Calendar"), href: "shifts-calendar" },
      ...((team?.resourcePermission ?? -1) >= 2 // WRITE
        ? [
            { name: i18n.t("Members"), href: "members" },
            { name: i18n.t("Invitations"), href: "invitations" },
            { name: i18n.t("Settings"), href: "settings" },
          ]
        : []),
    ],
    [team?.resourcePermission]
  );
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <Suspense>
      <div>
        <BreadcrumbNav />
        <Tabs tabs={tabs} onChange={setCurrentTab}>
          {currentTab.href === "members" && <TeamMembers />}
          {currentTab.href === "invitations" && <TeamInvites />}
          {currentTab.href === "leave-schedule" && <TeamLeaveSchedule />}
          {currentTab.href === "shifts-calendar" && <TeamShiftsCalendar />}
          {currentTab.href === "settings" && <TeamSettings />}
        </Tabs>
      </div>
    </Suspense>
  );
};
