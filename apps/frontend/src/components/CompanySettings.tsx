import { useMemo, useState } from "react";
import { Tabs } from "./Tabs";
import { CompanyLeaveTypes } from "./CompanyLeaveTypes";
import { CompanyYearlyQuota } from "./CompanyYearlyQuota";

export const CompanySettings = () => {
  const tabs = useMemo(
    () => [
      { name: "Leave Types", href: "leave-types" },
      { name: "Yearly quota", href: "yearly-quota" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab" />
      {tab.href === "leave-types" && <CompanyLeaveTypes />}
      {tab.href === "yearly-quota" && <CompanyYearlyQuota />}
    </div>
  );
};
