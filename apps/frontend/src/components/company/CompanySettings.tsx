import {
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { useMemo, useState } from "react";

import { Tabs, type Tab } from "../molecules/Tabs";

import { CompanyLeaveTypes } from "./CompanyLeaveTypes";
import { CompanyWorkSchedule } from "./CompanyWorkSchedule";
import { CompanyYearlyQuota } from "./CompanyYearlyQuota";

const CompanySettings = () => {
  const tabs = useMemo<Tab[]>(
    () => [
      {
        name: i18n.t("Leave Types"),
        href: "leave-types",
        icon: DocumentTextIcon,
      },
      {
        name: i18n.t("Yearly quota"),
        href: "yearly-quota",
        icon: CalendarDaysIcon,
      },
      { name: i18n.t("Work schedule"), href: "work-schedule", icon: ClockIcon },
    ],
    []
  );
  const [tab, setTab] = useState<Tab>(tabs[0]);
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
