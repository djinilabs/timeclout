import { useState } from "react";
import { AllUnitTeams } from "../components/AllUnitTeams";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { Tabs } from "../components/stateless/Tabs";
import { UnitSettings } from "../components/UnitSettings";
import { Suspense } from "../components/stateless/Suspense";

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
