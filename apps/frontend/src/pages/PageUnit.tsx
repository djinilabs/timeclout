import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { i18n } from "@lingui/core";
import unitQuery from "@/graphql-client/queries/unitQuery.graphql";
import { getDefined } from "@/utils";
import { Query, QueryUnitArgs } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { AllUnitTeams } from "../components/unit/AllUnitTeams";
import { Tabs } from "../components/molecules/Tabs";
import { UnitSettings } from "../components/unit/UnitSettings";
import { Suspense } from "../components/atoms/Suspense";

export const PageUnit = () => {
  const { unit: unitPk } = useParams();
  const [queryResponse] = useQuery<{ unit: Query["unit"] }, QueryUnitArgs>({
    query: unitQuery,
    variables: {
      unitPk: getDefined(unitPk, "No unit provided"),
    },
  });
  const unit = queryResponse.data?.unit;
  const tabs = useMemo(
    () => [
      { name: i18n.t("Teams"), href: "teams" },
      ...((unit?.resourcePermission ?? -1) >= 2 // WRITE
        ? [{ name: i18n.t("Settings"), href: "settings" }]
        : []),
    ],
    [unit?.resourcePermission]
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <Suspense>
      <Tabs tabs={tabs} onChange={setTab}>
        {tab.href === "teams" && <AllUnitTeams />}
        {tab.href === "settings" && <UnitSettings />}
      </Tabs>
    </Suspense>
  );
};
