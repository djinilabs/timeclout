import { DayDate } from "@/day-date";

import { FC, ReactNode, useMemo, useState } from "react";
import { type Day, MonthDailyCalendar } from "./MonthDailyCalendar";
import { i18n } from "@lingui/core";
import { Tabs } from "./Tabs";
import {
  MonthlyCalendarPerMember,
  type User,
} from "./MonthlyCalendarPerMember";

export interface TeamShiftsCalendarProps {
  show?: boolean;
  onDayFocus?: (day: string) => void;
  focusedDay?: string;
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  renderDay: (day: Day, dayIndex: number) => React.ReactNode;
  members: User[];
  renderMemberDay: (
    member: User,
    day: DayDate,
    calIndex: number
  ) => React.ReactNode;
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
  onAdd?: () => unknown;
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

  console.log("members:", props.members);

  return (
    <Tabs tabs={tabs} tabPropName="shiftsCalendarTab" onChange={setTab}>
      {tab.href === "by-day" && <MonthDailyCalendar {...props} />}
      {tab.href === "by-member" && (
        <MonthlyCalendarPerMember
          year={props.year}
          month={props.month}
          goTo={props.goTo}
          members={props.members}
          renderMemberDay={props.renderMemberDay}
          onAdd={props.onAdd}
        />
      )}
    </Tabs>
  );
};
