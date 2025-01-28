import { useMemo, useState } from "react";
import { Tabs } from "./Tabs";
import { TeamQualifications } from "./TeamQualifications";

export const TeamSettings = () => {
  const tabs = useMemo(
    () => [{ name: "Qualifications", href: "qualifications" }],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab">
        {tab.href === "qualifications" && <TeamQualifications />}
      </Tabs>
    </div>
  );
};
