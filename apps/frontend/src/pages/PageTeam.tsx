import { useState } from "react";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { type Tab, Tabs } from "../components/Tabs";
import { TeamMembers } from "../components/TeamMembers";
import { TeamInvites } from "../components/TeamInvites";
import { TeamLeaveSchedule } from "../components/TeamLeaveSchedule";
import { Suspense } from "../components/stateless/Suspense";
import { TeamShiftsCalendar } from "../components/TeamShiftsCalendar";
import { TeamSettings } from "../components/TeamSettings";

const tabs: Tab[] = [
  { name: "Members", href: "members" },
  { name: "Invitations", href: "invitations" },
  { name: "Leave Schedule", href: "leave-schedule" },
  { name: "Shifts Calendar", href: "shifts-calendar" },
  { name: "Settings", href: "settings" },
];

export const PageTeam = () => {
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
