import { DayDate } from "@/day-date";
import { FC, PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { type Day, MonthDailyCalendar } from "../particles/MonthDailyCalendar";
import { i18n } from "@lingui/core";
import { TeamShiftsSummary } from "./TeamShiftsSummary";
import { CalendarHeader } from "../atoms/CalendarHeader";
import { Tabs } from "../molecules/Tabs";
import {
  MonthlyCalendarPerMember,
  type User,
} from "../atoms/MonthlyCalendarPerMember";
import { AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { Suspense } from "../atoms/Suspense";

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
  const tabs = useMemo(
    () => [
      { name: i18n.t("By day"), href: "by-day" },
      { name: i18n.t("By member"), href: "by-member" },
      { name: i18n.t("By duration"), href: "by-duration" },
    ],
    []
  );
  const [tab, setTab] = useState(tabs[0]);

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
          </div>
          <Suspense>
            <div className="h-full overflow-y-auto relative">{props.tools}</div>
          </Suspense>
        </div>
      </Tabs>
    </div>
  );
};
