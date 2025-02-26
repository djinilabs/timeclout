import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import companyQuery from "@/graphql-client/queries/companyQuery.graphql";
import { AllCompanyUnits } from "../components/AllCompanyUnits";
import { Tabs } from "../components/stateless/Tabs";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { CompanySettings } from "../components/CompanySettings";
import { CompanyTimeOff } from "../components/CompanyTimeOff";
import { Suspense } from "../components/stateless/Suspense";
import { PendingCompanyLeaveRequests } from "../components/PendingCompanyLeaveRequests";
import { MyLeaveRequests } from "../components/MyLeaveRequests";
import { PageNotFound } from "./PageNotFound";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryCompanyArgs } from "../graphql/graphql";

export const PageCompany: FC = () => {
  const { company: companyPk } = useParams();
  const [queryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs
  >({
    query: companyQuery,
    variables: {
      companyPk: getDefined(companyPk, "No company provided"),
    },
  });

  const company = queryResponse.data?.company;
  const tabs = useMemo(
    () => [
      { name: "Company Units", href: "units" },
      { name: "My Time Off", href: "time-off" },
      { name: "My Leave Requests", href: "my-leave-requests" },
      ...((company?.resourcePermission ?? -1) >= 2 // WRITE
        ? [
            { name: "Company Settings", href: "settings" },
            { name: "Pending Leave Requests", href: "pending-leave-requests" },
          ]
        : []),
    ],
    [company?.resourcePermission]
  );
  const [tab, setTab] = useState(tabs[0]);

  return (
    <Suspense>
      <BreadcrumbNav />

      <Tabs tabs={tabs} onChange={setTab}>
        {(() => {
          if (tab.href === "units") {
            return <AllCompanyUnits />;
          } else if (tab.href === "settings") {
            return <CompanySettings />;
          } else if (tab.href === "time-off") {
            return <CompanyTimeOff />;
          } else if (tab.href === "my-leave-requests") {
            return <MyLeaveRequests />;
          } else if (tab.href === "pending-leave-requests") {
            return <PendingCompanyLeaveRequests />;
          } else {
            return <PageNotFound />;
          }
        })()}
      </Tabs>
    </Suspense>
  );
};
