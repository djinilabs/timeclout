import { useMemo, useState } from "react";
import { Tabs } from "./stateless/Tabs";
import { TeamQualifications } from "./TeamQualifications";
import { TeamSchedulePositionTemplates } from "./TeamSchedulePositionTemplates";

export const TeamSettings = () => {
  const tabs = useMemo(
    () => [
      { name: "Qualifications", href: "qualifications" },
      {
        name: "Schedule Position Templates",
        href: "schedule-position-templates",
      },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab">
        {tab.href === "qualifications" && <TeamQualifications />}
        {tab.href === "schedule-position-templates" && (
          <TeamSchedulePositionTemplates />
        )}
      </Tabs>
    </div>
  );
};
