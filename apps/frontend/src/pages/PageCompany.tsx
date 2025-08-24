import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { FC, lazy, useMemo, useState } from "react";

import { Suspense } from "../components/atoms/Suspense";
import { Tabs, type Tab } from "../components/molecules/Tabs";
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
          switch (tab.href) {
          case "units": {
            return <AllCompanyUnits />;
          }
          case "settings": {
            return <CompanySettings />;
          }
          case "time-off": {
            return <CompanyTimeOff />;
          }
          case "my-leave-requests": {
            return <MyLeaveRequests />;
          }
          case "pending-leave-requests": {
            return <PendingCompanyLeaveRequests />;
          }
          default: {
            return <PageNotFound />;
          }
          }
        })()}
      </Tabs>
    </Suspense>
  );
};
