import { useMemo, useState } from "react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Tabs, type Tab } from "../molecules/Tabs";
import { UnitManagers } from "./UnitManagers";

export const UnitSettings = () => {
  const tabs = useMemo<Tab[]>(
    () => [{ name: "Managers", href: "managers", icon: UsersIcon }],
    []
  );
  const [tab, setTab] = useState<Tab>(tabs[0]);
  return (
    <div>
      <Tabs
        tabs={tabs}
        onChange={setTab}
        tabPropName="settingsTab"
        ariaLabel="Unit settings tabs"
      >
        {tab.href === "managers" && <UnitManagers />}
      </Tabs>
    </div>
  );
};
