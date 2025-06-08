import { Trans } from "@lingui/react/macro";
import { FC, memo, useMemo } from "react";
import { classNames } from "../../utils/classNames";
import { DayDate } from "@/day-date";
import { generateMonthDays } from "../../utils/generateMonthDays";

export interface Day {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
}

export interface MonthDailyCalendarProps {
  show?: boolean;
  year: number;
  month: number;
  renderDay: (day: Day, calIndex: number) => React.ReactNode;
  onCellDrop?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragEnter?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragLeave?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragOver?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  focusedDay?: string;
  onDayFocus?: (day: string) => void;
}

export const MonthDailyCalendar: FC<MonthDailyCalendarProps> = memo(
  ({
    show = true,
    year,
    month,
    renderDay,
    onCellDrop,
    onCellDragEnter,
    onCellDragLeave,
    onCellDragOver,
    onDayFocus,
    focusedDay,
  }) => {
    const days = useMemo(() => {
      return generateMonthDays(year, month, DayDate.today());
    }, [year, month]);

    if (!show) {
      return;
    }

    return (
      <div
        key="calendar-container"
        className={classNames("flex h-full flex-col")}
        role="application"
        aria-label={`Calendar for ${month}/${year}`}
      >
        <div
          key="calendar-body"
          className="ring-1 shadow-xs ring-black/5 flex flex-auto flex-col rounded-lg overflow-hidden"
          role="grid"
          aria-label="Calendar grid"
        >
          <div
            key="weekday-headers"
            className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 flex-none"
            role="row"
            aria-label="Weekday headers"
          >
            <div key="monday-header" className="bg-white py-2">
              <Trans id="M for Monday">M</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="on for Monday">on</Trans>
              </span>
            </div>
            <div key="tuesday-header" className="bg-white py-2">
              <Trans id="T for Tuesday">T</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="ue for Tuesday">ue</Trans>
              </span>
            </div>
            <div key="wednesday-header" className="bg-white py-2">
              <Trans id="W for Wednesday">W</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="ed for Wednesday">wednesday</Trans>
              </span>
            </div>
            <div key="thursday-header" className="bg-white py-2">
              <Trans id="T for Thursday">T</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="hu for Thursday">hu</Trans>
              </span>
            </div>
            <div key="friday-header" className="bg-white py-2">
              <Trans id="F for Friday">F</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="ri for Friday">ri</Trans>
              </span>
            </div>
            <div key="saturday-header" className="bg-white py-2">
              <Trans id="S for Saturday">S</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="at for Saturday">at</Trans>
              </span>
            </div>
            <div key="sunday-header" className="bg-white py-2">
              <Trans id="S for Sunday">S</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="un for Sunday">un</Trans>
              </span>
            </div>
          </div>
          <div key="calendar-grid" className="flex text-xs/6 text-gray-700">
            <div
              key="days-grid"
              className="divide-y divide-x divide-gray-200 w-full grid grid-cols-7 gap-0"
              role="grid"
              aria-label="Calendar days"
            >
              {days.map((day, index) => (
                <div
                  key={`day-${day.date}`}
                  tabIndex={index * 100}
                  autoFocus={index === 0}
                  onFocus={() => onDayFocus?.(day.date)}
                  onDrop={(e) => onCellDrop?.(day.date, e)}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    onCellDragEnter?.(day.date, e);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    onCellDragLeave?.(day.date, e);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    onCellDragOver?.(day.date, e);
                  }}
                  role="gridcell"
                  aria-current={day.isToday ? "date" : undefined}
                  aria-label={`${day.date}${day.isToday ? " (Today)" : ""}${
                    !day.isCurrentMonth ? " (Not in current month)" : ""
                  }`}
                  className={classNames(
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                    day.isToday && "font-semibold",
                    day.isToday && "text-teal-600",
                    day.isCurrentMonth && !day.isToday && "text-gray-900",
                    !day.isCurrentMonth && !day.isToday && "text-gray-500",
                    focusedDay === day.date &&
                      "border border-dashed border-teal-300 -p-1",
                    "flex flex-col min-h-[8rem] pt-2"
                  )}
                >
                  <time
                    key={`time-${day.date}`}
                    dateTime={day.date}
                    className="ml-auto pr-2 font-extrabold"
                  >
                    {day.date.split("-").pop()?.replace(/^0/, "")}
                  </time>
                  <div
                    key={`day-content-${day.date}`}
                    className="h-full w-full overflow-hidden"
                  >
                    {renderDay(day, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
