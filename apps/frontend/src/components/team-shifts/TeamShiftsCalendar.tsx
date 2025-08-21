import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { FC, PropsWithChildren, ReactNode, useMemo, useState } from "react";


import { AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { CalendarHeader } from "../atoms/CalendarHeader";
import {
  MonthlyCalendarPerMember,
  type User,
} from "../atoms/MonthlyCalendarPerMember";
import { Suspense } from "../atoms/Suspense";
import { Tabs, type Tab } from "../molecules/Tabs";
import { type Day, MonthDailyCalendar } from "../particles/MonthDailyCalendar";

import { TeamShiftsStats } from "./TeamShiftsStats";
import { TeamShiftsSummary } from "./TeamShiftsSummary";

import { DayDate } from "@/day-date";

export interface TeamShiftsCalendarProps {
  shiftPositionsMap: Record<string, AnalyzedShiftPosition[]>;
  show?: boolean;
  onDayFocus?: (day: string) => void;
  focusedDay?: string;
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  renderDay: (day: Day, dayIndex: number) => ReactNode;
  members: User[];
  renderMemberDay: (member: User, day: DayDate, calIndex: number) => ReactNode;
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
  tools?: ReactNode;
}

export const TeamShiftsCalendar: FC<
  PropsWithChildren<TeamShiftsCalendarProps>
> = ({ children, ...props }) => {
  const tabs = useMemo<Tab[]>(
    () => [
      { name: i18n.t("By day"), href: "by-day", icon: CalendarDaysIcon },
      { name: i18n.t("By member"), href: "by-member", icon: UsersIcon },
      { name: i18n.t("By duration"), href: "by-duration", icon: ClockIcon },
      { name: i18n.t("Stats"), href: "stats", icon: ChartBarIcon },
    ],
    []
  );
  const [tab, setTab] = useState<Tab>(tabs[0]);

  return (
    <div>
      <CalendarHeader {...props} />
      <Tabs
        tabs={tabs}
        tabPropName="shiftsCalendarTab"
        onChange={setTab}
        aria-label={i18n.t("Calendar view options")}
      >
        {children}
        <div className="mt-8 flex flex-row gap-4">
          <div className="flex-1">
            {tab.href === "by-day" && <MonthDailyCalendar {...props} />}
            {tab.href === "by-member" && (
              <MonthlyCalendarPerMember {...props} />
            )}
            {tab.href === "by-duration" && <TeamShiftsSummary {...props} />}
            {tab.href === "stats" && <TeamShiftsStats {...props} />}
          </div>
          <Suspense>
            <div className="h-full overflow-y-auto relative">{props.tools}</div>
          </Suspense>
        </div>
      </Tabs>
    </div>
  );
};
