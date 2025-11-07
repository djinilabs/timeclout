import { AcademicCapIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { useMemo, useState } from "react";

import { Tabs, type Tab } from "../molecules/Tabs";

import { TeamQualifications } from "./TeamQualifications";
import { TeamSchedulePositionTemplates } from "./TeamSchedulePositionTemplates";

export const TeamSettings = () => {
  const tabs = useMemo<Tab[]>(
    () => [
      {
        name: i18n.t("Qualifications"),
        href: "qualifications",
        icon: AcademicCapIcon,
      },
      {
        name: i18n.t("Schedule Position Templates"),
        href: "schedule-position-templates",
        icon: DocumentTextIcon,
      },
    ],
    []
  );
  const [tab, setTab] = useState<Tab>(tabs[0]);
  return (
    <div>
      <Tabs
        tabs={tabs}
        onChange={setTab}
        tabPropName="settingsTab"
        ariaLabel="Team settings"
      >
        {tab.href === "qualifications" && <TeamQualifications />}
        {tab.href === "schedule-position-templates" && (
          <TeamSchedulePositionTemplates />
        )}
      </Tabs>
    </div>
  );
};
