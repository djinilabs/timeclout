import { useMemo, useState } from "react";
import { i18n } from "@lingui/core";
import { Tabs } from "../molecules/Tabs";
import { TeamQualifications } from "./TeamQualifications";
import { TeamSchedulePositionTemplates } from "./TeamSchedulePositionTemplates";

export const TeamSettings = () => {
  const tabs = useMemo(
    () => [
      { name: i18n.t("Qualifications"), href: "qualifications" },
      {
        name: i18n.t("Schedule Position Templates"),
        href: "schedule-position-templates",
      },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
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
