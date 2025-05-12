import { FC, ReactNode, useState } from "react";
import { classNames } from "../../utils/classNames";

export interface VerticalTabsProps {
  tabs: {
    id: string;
    label: ReactNode;
    content: ReactNode;
  }[];
}

export const VerticalTabs: FC<VerticalTabsProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]?.id ?? "");

  const selectedTabIndex = tabs.findIndex((tab) => tab.id === selectedTab);

  return (
    <div className="flex flex-row space-x-4" aria-label="Tabs">
      <nav className="flex flex-col" aria-label="Tab list">
        {tabs.map((tab, index) => {
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={classNames(
                "border-l-2 border-gray-100",
                "flex flex-col p-2 ",
                selectedTab !== tab.id
                  ? "bg-gray-200 border-r-gray-300"
                  : "border-y-gray-300",
                index === selectedTabIndex - 1 && "rounded-br-md",
                index === selectedTabIndex + 1 && "rounded-tr-md"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      {tabs.find((tab) => tab.id === selectedTab)?.content}
    </div>
  );
};
