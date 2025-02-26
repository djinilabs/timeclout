import { useMemo, useState } from "react";
import unitQuery from "@/graphql-client/queries/unitQuery.graphql";
import { getDefined } from "@/utils";
import { AllUnitTeams } from "../components/AllUnitTeams";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { Tabs } from "../components/stateless/Tabs";
import { UnitSettings } from "../components/UnitSettings";
import { Suspense } from "../components/stateless/Suspense";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryUnitArgs } from "../graphql/graphql";

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
      { name: "Teams", href: "teams" },
      ...((unit?.resourcePermission ?? -1) >= 2 // WRITE
        ? [{ name: "Settings", href: "settings" }]
        : []),
    ],
    [unit?.resourcePermission]
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <Suspense>
      <BreadcrumbNav />
      <Tabs tabs={tabs} onChange={setTab}>
        {tab.href === "teams" && <AllUnitTeams />}
        {tab.href === "settings" && <UnitSettings />}
      </Tabs>
    </Suspense>
  );
};
