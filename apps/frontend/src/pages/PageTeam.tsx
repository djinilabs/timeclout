import { Suspense, useState } from "react";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { type Tab, Tabs } from "../components/Tabs";
import { TeamMembers } from "../components/TeamMembers";
import { TeamInvites } from "../components/TeamInvites";

const tabs: Tab[] = [
  { name: "Members", href: "members" },
  { name: "Invitations", href: "invitations" },
];

export const PageTeam = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <BreadcrumbNav />
        <Tabs tabs={tabs} onChange={setCurrentTab} />
      </div>
      {currentTab.href === "members" ? (
        <TeamMembers />
      ) : currentTab.href === "invitations" ? (
        <TeamInvites />
      ) : null}
    </Suspense>
  );
};
