import { FC, memo, ReactNode, useEffect, useState } from "react";

import { classNames } from "../../utils/classNames";

export interface VerticalTabsProperties {
  tabs: {
    id: string;
    label: ReactNode;
    content: ReactNode;
  }[];
}

export const VerticalTabs: FC<VerticalTabsProperties> = memo(({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]?.id ?? "");

  useEffect(() => {
    if (!tabs.find((tab) => tab.id === selectedTab)) {
      setSelectedTab(tabs[0]?.id ?? "");
    }
  }, [tabs, selectedTab]);

  const selectedTabIndex = tabs.findIndex((tab) => tab.id === selectedTab);

  return (
    <div
      className="flex flex-row space-x-4"
      role="tablist"
      aria-label="Vertical tabs"
    >
      <nav className="flex flex-col" aria-label="Tab list">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            role="tab"
            aria-selected={selectedTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={classNames(
              "opacity-70 flex flex-col p-2 border-gray-400 ",
              index === 0 && "border-t-0",
              index === selectedTabIndex - 1 && "rounded-br-md",
              index === selectedTabIndex + 1 && "rounded-tr-md",
              selectedTab === tab.id
                ? "border-y border-l rounded-md"
                : "bg-gray-200 border-r-1"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div
        role="tabpanel"
        id={`panel-${selectedTab}`}
        aria-labelledby={`tab-${selectedTab}`}
        className="flex-1"
      >
        {tabs.find((tab) => tab.id === selectedTab)?.content}
      </div>
    </div>
  );
});

VerticalTabs.displayName = "VerticalTabs";
