import { FC, lazy, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { i18n } from "@lingui/core";
import { getDefined } from "@/utils";
import companyQuery from "@/graphql-client/queries/companyQuery.graphql";
import { Tabs } from "../components/stateless/Tabs";
import { Suspense } from "../components/stateless/Suspense";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryCompanyArgs } from "../graphql/graphql";

const PageNotFound = lazy(() => import("./PageNotFound"));
const AllCompanyUnits = lazy(() => import("../components/AllCompanyUnits"));
const CompanySettings = lazy(() => import("../components/CompanySettings"));
const CompanyTimeOff = lazy(() => import("../components/CompanyTimeOff"));
const PendingCompanyLeaveRequests = lazy(
  () => import("../components/PendingCompanyLeaveRequests")
);
const MyLeaveRequests = lazy(() => import("../components/MyLeaveRequests"));

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
      { name: i18n.t("Company Units"), href: "units" },
      { name: i18n.t("My Time Off"), href: "time-off" },
      { name: i18n.t("My Leave Requests"), href: "my-leave-requests" },
      ...((company?.resourcePermission ?? -1) >= 2 // WRITE
        ? [
            { name: i18n.t("Company Settings"), href: "settings" },
            {
              name: i18n.t("Pending Leave Requests"),
              href: "pending-leave-requests",
            },
          ]
        : []),
    ],
    [company?.resourcePermission]
  );
  const [tab, setTab] = useState(tabs[0]);

  return (
    <Suspense>
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
