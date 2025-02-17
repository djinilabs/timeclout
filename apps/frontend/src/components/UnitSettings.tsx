import { useMemo, useState } from "react";
import { Tabs } from "./stateless/Tabs";
import { UnitManagers } from "./UnitManagers";

export const UnitSettings = () => {
  const tabs = useMemo(() => [{ name: "Managers", href: "managers" }], []);
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <Tabs tabs={tabs} onChange={setTab} tabPropName="settingsTab">
        {tab.href === "managers" && <UnitManagers />}
      </Tabs>
    </div>
  );
};
