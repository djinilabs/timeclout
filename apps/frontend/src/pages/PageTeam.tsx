import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { useMemo, useState } from "react";

import { Suspense } from "../components/atoms/Suspense";
import { type Tab, Tabs } from "../components/molecules/Tabs";
import { TeamCalendarIntegrations } from "../components/team/TeamCalendarIntegrations";
import { TeamInvites } from "../components/team/TeamInvites";
import { TeamLeaveSchedule } from "../components/team/TeamLeaveSchedule";
import { TeamMembers } from "../components/team/TeamMembers";
import { TeamSettings } from "../components/team/TeamSettings";
import { TeamShiftsSchedule } from "../components/team-shifts/TeamShiftsSchedule";
import { useEntityNavigationContext } from "../hooks/useEntityNavigationContext";

export const PageTeam = () => {
  const { team } = useEntityNavigationContext();
  const tabs = useMemo<Tab[]>(
    () => [
      ...((team?.resourcePermission ?? -1) >= 2
        ? [{ name: i18n.t("Members"), href: "members", icon: UsersIcon }]
        : []),
      {
        name: i18n.t("Leave Schedule"),
        href: "leave-schedule",
        icon: CalendarDaysIcon,
      },
      {
        name: i18n.t("Shifts Calendar"),
        href: "shifts-calendar",
        icon: DocumentDuplicateIcon,
      },
      ...((team?.resourcePermission ?? -1) >= 2 // WRITE
        ? [
            {
              name: i18n.t("Invitations"),
              href: "invitations",
              icon: EnvelopeIcon,
            },
            { name: i18n.t("Settings"), href: "settings", icon: Cog6ToothIcon },
          ]
        : []),
      {
        name: i18n.t("Calendar integrations"),
        href: "calendar-integrations",
        icon: WrenchScrewdriverIcon,
      },
    ],
    [team?.resourcePermission]
  );
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0]);

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
