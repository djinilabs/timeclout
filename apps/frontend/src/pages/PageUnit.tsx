import { useState } from "react";
import { Suspense } from "../components/Suspense";
import { AllUnitTeams } from "../components/AllUnitTeams";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { Tabs } from "../components/Tabs";
import { UnitSettings } from "../components/UnitSettings";

const tabs = [
  { name: "Teams", href: "teams" },
  { name: "Settings", href: "settings" },
];

export const PageUnit = () => {
  const [tab, setTab] = useState(tabs[0]);
  return (
    <Suspense>
      <BreadcrumbNav />
      <Tabs tabs={tabs} onChange={setTab}>
        {tab.href === "teams" && <AllUnitTeams />}
        {tab.href === "settings" && <UnitSettings />}
      </Tabs>
    </Suspense>
  );
};
