import { Cog6ToothIcon, UsersIcon } from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Suspense } from "../components/atoms/Suspense";
import { Tabs, type Tab } from "../components/molecules/Tabs";
import { AllUnitTeams } from "../components/unit/AllUnitTeams";
import { UnitSettings } from "../components/unit/UnitSettings";
import { Query, QueryUnitArgs } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

import unitQuery from "@/graphql-client/queries/unitQuery.graphql";
import { getDefined } from "@/utils";

export const PageUnit = () => {
  const { unit: unitPk } = useParams();
  const [queryResponse] = useQuery<{ unit: Query["unit"] }, QueryUnitArgs>({
    query: unitQuery,
    variables: {
      unitPk: getDefined(unitPk, "No unit provided"),
    },
  });
  const unit = queryResponse.data?.unit;
  const tabs = useMemo<Tab[]>(
    () => [
      { name: i18n.t("Teams"), href: "teams", icon: UsersIcon },
      ...((unit?.resourcePermission ?? -1) >= 2 // WRITE
        ? [{ name: i18n.t("Settings"), href: "settings", icon: Cog6ToothIcon }]
        : []),
    ],
    [unit?.resourcePermission]
  );
  const [tab, setTab] = useState<Tab>(tabs[0]);
  return (
    <Suspense>
      <Tabs tabs={tabs} onChange={setTab}>
        {tab.href === "teams" && <AllUnitTeams />}
        {tab.href === "settings" && <UnitSettings />}
      </Tabs>
    </Suspense>
  );
};
