import { useMemo, useState } from "react";
import { i18n } from "@lingui/core";
import { Tabs } from "./stateless/Tabs";
import { CompanyLeaveTypes } from "./CompanyLeaveTypes";
import { CompanyYearlyQuota } from "./CompanyYearlyQuota";
import { CompanyWorkSchedule } from "./CompanyWorkSchedule";

const CompanySettings = () => {
  const tabs = useMemo(
    () => [
      { name: i18n.t("Leave Types"), href: "leave-types" },
      { name: i18n.t("Yearly quota"), href: "yearly-quota" },
      { name: i18n.t("Work schedule"), href: "work-schedule" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab">
        {tab.href === "leave-types" && <CompanyLeaveTypes />}
        {tab.href === "yearly-quota" && <CompanyYearlyQuota />}
        {tab.href === "work-schedule" && <CompanyWorkSchedule />}
      </Tabs>
    </div>
  );
};

export default CompanySettings;
