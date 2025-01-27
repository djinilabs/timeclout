import { useState } from "react";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { type Tab, Tabs } from "../components/Tabs";
import { TeamMembers } from "../components/TeamMembers";
import { TeamInvites } from "../components/TeamInvites";
import { TeamLeaveSchedule } from "../components/TeamLeaveSchedule";
import { Suspense } from "../components/Suspense";
import { TeamShiftsCalendar } from "../components/TeamShiftsCalendar";

const tabs: Tab[] = [
  { name: "Members", href: "members" },
  { name: "Invitations", href: "invitations" },
  { name: "Leave Schedule", href: "leave-schedule" },
  { name: "Shifts Calendar", href: "shifts-calendar" },
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
        </Tabs>
      </div>
    </Suspense>
  );
};
