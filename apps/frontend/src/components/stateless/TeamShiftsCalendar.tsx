import { FC, ReactNode, useMemo, useState } from "react";
import { type Day, MonthDailyCalendar } from "./MonthDailyCalendar";
import { i18n } from "@lingui/core";
import { Tabs } from "./Tabs";

export interface TeamShiftsCalendarProps {
  show?: boolean;
  onDayFocus?: (day: string) => void;
  focusedDay?: string;
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  renderDay: (day: Day, dayIndex: number) => React.ReactNode;
  onCellDrop?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragEnter?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragLeave?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragOver?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  additionalActions?: Array<
    | {
        type: "button";
        text: ReactNode;
        onClick: () => void;
      }
    | {
        type: "component";
        component: ReactNode;
      }
  >;
}

export const TeamShiftsCalendar: FC<TeamShiftsCalendarProps> = (props) => {
  const tabs = useMemo(
    () => [
      { name: i18n.t("By day"), href: "by-day" },
      { name: i18n.t("By member"), href: "by-member" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);
  return (
    <Tabs tabs={tabs} tabPropName="shiftsCalendarTab" onChange={setTab}>
      {tab.href === "by-day" && <MonthDailyCalendar {...props} />}
      {tab.href === "by-member" && <MonthDailyCalendar {...props} />}
    </Tabs>
  );
};
