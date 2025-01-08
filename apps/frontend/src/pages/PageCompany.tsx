import { FC, Suspense, useMemo, useState } from "react";
import { AllCompanyUnits } from "../components/AllCompanyUnits";
import { Tabs } from "../components/Tabs";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { CompanySettings } from "../components/CompanySettings";
import { CompanyTimeOff } from "../components/CompanyTimeOff";

export const PageCompany: FC = () => {
  const tabs = useMemo(
    () => [
      { name: "Company Units", href: "units" },
      { name: "Company Settings", href: "settings" },
      { name: "Company Time Off", href: "time-off" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BreadcrumbNav />

      <Tabs tabs={tabs} onChange={setTab} />
      {tab.href === "units" && <AllCompanyUnits />}
      {tab.href === "settings" && <CompanySettings />}
      {tab.href === "time-off" && <CompanyTimeOff />}
    </Suspense>
  );
};
