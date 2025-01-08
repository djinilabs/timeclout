import { useMemo, useState } from "react";
import { Tabs } from "./Tabs";
import { CompanyLeaveTypes } from "./CompanyLeaveTypes";

export const CompanySettings = () => {
  const tabs = useMemo(
    () => [{ name: "Leave Types", href: "leave-types" }],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab" />
      {tab.href === "leave-types" && <CompanyLeaveTypes />}
    </div>
  );
};
