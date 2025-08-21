import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { FC, PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSearchParam } from "../../hooks/useSearchParam";
import { classNames } from "../../utils/classNames";
import { Suspense } from "../atoms/Suspense";

export interface Tab {
  name: string;
  count?: string;
  href: string;
  className?: string;
  icon?: React.ElementType;
}

export interface TabsProps {
  tabPropName?: string;
  tabs: Tab[];
  onChange?: (tab: Tab) => void;
  className?: string;
  ariaLabel?: string;
}

export const Tabs: FC<PropsWithChildren<TabsProps>> = ({
  tabs,
  onChange,
  tabPropName = "tab",
  className = "",
  children,
  ariaLabel = "Tabs navigation",
}) => {
  const { current: currentTabName, set, params } = useSearchParam(tabPropName);

  const onTabChange = useCallback(
    (tab: Tab | undefined) => {
      if (tab) {
        set(tab.href);
      }
    },
    [set]
  );

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.href == currentTabName) ?? tabs[0],
    [tabs, currentTabName]
  );

  useEffect(() => {
    onChange?.(currentTab);
  }, [currentTab, onChange]);

  const location = useLocation();

  return (
    <>
      <div
        className={`grid grid-cols-1 sm:hidden ${className}`}
        role="tablist"
        aria-label={ariaLabel}
      >
        <select
          defaultValue={currentTab?.name}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline focus:-outline-offset-2 focus:outline-teal-600"
          onChange={(e) =>
            onTabChange(tabs.find((tab) => tab.name === e.target.value))
          }
          aria-controls="tab-panel"
        >
          {tabs.map((tab) => (
            <option
              key={tab.name}
              role="tab"
              aria-selected={tab.href === currentTab?.href}
            >
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            aria-label={ariaLabel}
            role="tablist"
            className="-mb-px flex space-x-8"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={{
                  pathname: location.pathname,
                  search: new URLSearchParams({
                    ...Object.fromEntries(params),
                    [tabPropName]: tab.href,
                  }).toString(),
                }}
                role="tab"
                aria-selected={tab.href === currentTab?.href}
                aria-controls="tab-panel"
                aria-current={
                  tab.href === currentTab?.href ? "page" : undefined
                }
                aria-clickable
                aria-label={tab.name}
                className={classNames(
                  tab.href === currentTab?.href
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:border-teal-500 hover:text-teal-600",
                  "flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-200"
                )}
              >
                {tab.icon && (
                  <tab.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.href === currentTab?.href
                        ? "bg-teal-100 text-teal-600"
                        : "bg-gray-100 text-gray-900",
                      "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block"
                    )}
                    aria-label={`${tab.count} items`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div id="tab-panel" role="tabpanel" aria-labelledby={currentTab?.name}>
        <Suspense>{children}</Suspense>
      </div>
    </>
  );
};
