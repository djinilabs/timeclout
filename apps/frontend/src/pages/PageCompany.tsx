import { FC, useMemo, useState } from "react";
import { AllCompanyUnits } from "../components/AllCompanyUnits";
import { Tabs } from "../components/stateless/Tabs";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { CompanySettings } from "../components/CompanySettings";
import { CompanyTimeOff } from "../components/CompanyTimeOff";
import { Suspense } from "../components/stateless/Suspense";
export const PageCompany: FC = () => {
  const tabs = useMemo(
    () => [
      { name: "Company Units", href: "units" },
      { name: "Company Settings", href: "settings" },
      { name: "My Time Off", href: "time-off" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);

  return (
    <Suspense>
      <BreadcrumbNav />

      <Tabs tabs={tabs} onChange={setTab}>
        {tab.href === "units" && <AllCompanyUnits />}
        {tab.href === "settings" && <CompanySettings />}
        {tab.href === "time-off" && <CompanyTimeOff />}
      </Tabs>
    </Suspense>
  );
};
