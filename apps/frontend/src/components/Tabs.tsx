import { FC, useCallback, useEffect, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { classNames } from "../utils/classNames";
import { Link, useLocation, useNavigate } from "react-router-dom";

export interface Tab {
  name: string;
  count?: string;
  href: string;
}

export interface TabsProps {
  tabs: Tab[];
  onChange: (tab: Tab) => void;
}

export const Tabs: FC<TabsProps> = ({ tabs, onChange }) => {
  const navigate = useNavigate();

  const onTabChange = useCallback(
    (tab: Tab | undefined) => {
      if (tab) {
        navigate(loc.pathname + "#" + tab.href);
      }
    },
    [navigate]
  );

  const loc = useLocation();
  const currentTab = useMemo(
    () => tabs.find((tab) => tab.href == loc.hash.slice(1)) ?? tabs[0],
    [tabs, loc.hash]
  );

  useEffect(() => {
    console.log("onChange", currentTab);
    onChange(currentTab);
  }, [currentTab]);

  return (
    <>
      <div className="grid grid-cols-1 sm:hidden">
        <select
          defaultValue={currentTab?.name}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          onChange={(e) =>
            onTabChange(tabs.find((tab) => tab.name === e.target.value))
          }
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={loc.pathname + "#" + tab.href}
                aria-current={
                  tab.href === currentTab?.href ? "page" : undefined
                }
                className={classNames(
                  tab.href === currentTab?.href
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                  "flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                )}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.href === currentTab?.href
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-900",
                      "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
