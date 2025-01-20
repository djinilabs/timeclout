import { useMemo, useState } from "react";
import { Tabs } from "./Tabs";
import { CompanyLeaveTypes } from "./CompanyLeaveTypes";
import { CompanyYearlyQuota } from "./CompanyYearlyQuota";
import { CompanyWorkSchedule } from "./CompanyWorkSchedule";

export const CompanySettings = () => {
  const tabs = useMemo(
    () => [
      { name: "Leave Types", href: "leave-types" },
      { name: "Yearly quota", href: "yearly-quota" },
      { name: "Work schedule", href: "work-schedule" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab" />
      {tab.href === "leave-types" && <CompanyLeaveTypes />}
      {tab.href === "yearly-quota" && <CompanyYearlyQuota />}
      {tab.href === "work-schedule" && <CompanyWorkSchedule />}
    </div>
  );
};
