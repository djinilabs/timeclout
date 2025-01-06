import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { Suspense, useState } from "react";
import { type Tab, Tabs } from "../components/Tabs";

const tabs: Tab[] = [
  { name: "Applied", href: "#applied", count: "52" },
  {
    name: "Phone Screening",
    href: "phone-screening",
    count: "6",
  },
  { name: "Interview", href: "interview", count: "4" },
  { name: "Offer", href: "offer" },
  { name: "Disqualified", href: "disqualified" },
];

export const PageTeam = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <BreadcrumbNav />
        <Tabs tabs={tabs} onChange={setCurrentTab} />
      </div>
    </Suspense>
  );
};
