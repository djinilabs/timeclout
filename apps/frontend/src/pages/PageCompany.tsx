import { FC, lazy, useMemo, useState } from "react";
import { i18n } from "@lingui/core";
import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Tabs, type Tab } from "../components/molecules/Tabs";
import { Suspense } from "../components/atoms/Suspense";
import { useEntityNavigationContext } from "../hooks/useEntityNavigationContext";

const PageNotFound = lazy(() => import("./PageNotFound"));
const AllCompanyUnits = lazy(
  () => import("../components/company/AllCompanyUnits")
);
const CompanySettings = lazy(
  () => import("../components/company/CompanySettings")
);
const CompanyTimeOff = lazy(
  () => import("../components/company/CompanyTimeOff")
);
const PendingCompanyLeaveRequests = lazy(
  () => import("../components/company/PendingCompanyLeaveRequests")
);
const MyLeaveRequests = lazy(
  () => import("../components/personal/MyLeaveRequests")
);

export const PageCompany: FC = () => {
  const { company } = useEntityNavigationContext();

  const tabs = useMemo(
    () => [
      { name: i18n.t("Company Units"), href: "units", icon: Squares2X2Icon },
      { name: i18n.t("My Time Off"), href: "time-off", icon: CalendarDaysIcon },
      {
        name: i18n.t("My Leave Requests"),
        href: "my-leave-requests",
        icon: DocumentDuplicateIcon,
      },
      ...((company?.resourcePermission ?? -1) >= 2 // WRITE
        ? [
            {
              name: i18n.t("Company Settings"),
              href: "settings",
              icon: Cog6ToothIcon,
            },
            {
              name: i18n.t("Pending Leave Requests"),
              href: "pending-leave-requests",
              icon: DocumentDuplicateIcon,
            },
          ]
        : []),
    ],
    [company?.resourcePermission]
  );
  const [tab, setTab] = useState<Tab>(tabs[0]);

  return (
    <Suspense>
      <Tabs
        tabs={tabs}
        onChange={setTab}
        className="company-header company-settings-button"
      >
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
