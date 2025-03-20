import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Trans } from "@lingui/react/macro";
import { Button } from "./Button";
import { FC, memo, ReactNode, useCallback, useMemo } from "react";
import { classNames } from "../../utils/classNames";
import { months } from "../../utils/months";
import { DayDate } from "@/day-date";
import { generateMonthDays } from "../../utils/generateMonthDays";

export interface Day {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
}

export interface MonthCalendarProps {
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
  year: number;
  month: number;
  goTo?: (year: number, month: number) => void;
  renderDay: (day: Day, calIndex: number) => React.ReactNode;
  onCellDrop?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragEnter?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragLeave?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragOver?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  focusedDay?: string;
  onDayFocus?: (day: string) => void;
}

export const MonthCalendar: FC<MonthCalendarProps> = memo(
  ({
    additionalActions,
    year,
    month,
    goTo,
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

    const handlePrevMonth = useCallback(() => {
      goTo?.(year, month - 1);
    }, [goTo, year, month]);

    const handleNextMonth = useCallback(() => {
      goTo?.(year, month + 1);
    }, [goTo, year, month]);

    const handleToday = useCallback(() => {
      goTo?.(new Date().getFullYear(), new Date().getMonth());
    }, [goTo]);

    return (
      <div className={classNames("flex h-full flex-col")}>
        <header className="flex items-center justify-between px-6 py-4 flex-none">
          <h1 className="text-base font-semibold text-gray-900">
            <time dateTime={`${year}-${month + 1}`}>
              {months()[month]} {year}
            </time>
          </h1>
          <div className="flex items-center">
            {goTo && (
              <div className="relative flex items-center rounded-md bg-white shadow-2xs">
                <button
                  type="button"
                  key="prev-month"
                  onClick={handlePrevMonth}
                  className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                >
                  <span className="sr-only">
                    <Trans>Previous month</Trans>
                  </span>
                  <ChevronLeftIcon className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  key="today"
                  onClick={handleToday}
                  className="hidden h-9 border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                >
                  <Trans>Today</Trans>
                </button>
                <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                <button
                  type="button"
                  key="next-month"
                  onClick={handleNextMonth}
                  className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                >
                  <span className="sr-only">
                    <Trans>Next month</Trans>
                  </span>
                  <ChevronRightIcon className="size-5" aria-hidden="true" />
                </button>
              </div>
            )}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {additionalActions?.map((action, index) => (
                <div key={index} className="ml-6">
                  {action.type === "button" ? (
                    <Button onClick={action.onClick}>{action.text}</Button>
                  ) : (
                    action.component
                  )}
                </div>
              ))}
            </div>
            <Menu as="div" className="relative ml-6 md:hidden">
              <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">
                  <Trans>Open menu</Trans>
                </span>
                <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {additionalActions?.map((action, index) =>
                    action.type === "component" ? (
                      <MenuItem key={index}>{action.component}</MenuItem>
                    ) : (
                      <MenuItem key={index}>
                        <a
                          onClick={action.onClick}
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          {action.text}
                        </a>
                      </MenuItem>
                    )
                  )}
                </div>
                {goTo && (
                  <div className="py-1">
                    <MenuItem>
                      <a
                        onClick={() =>
                          goTo?.(
                            new Date().getFullYear(),
                            new Date().getMonth()
                          )
                        }
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        <Trans>Go to today</Trans>
                      </a>
                    </MenuItem>
                  </div>
                )}
              </MenuItems>
            </Menu>
          </div>
        </header>
        <div className="ring-1 shadow-xs ring-black/5 flex flex-auto flex-col rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 flex-none">
            <div className="bg-white py-2">
              <Trans id="M for Monday">M</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="on for Monday">on</Trans>
              </span>
            </div>
            <div className="bg-white py-2">
              <Trans id="T for Tuesday">T</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="ue for Tuesday">ue</Trans>
              </span>
            </div>
            <div className="bg-white py-2">
              <Trans id="W for Wednesday">W</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="ed for Wednesday">wednesday</Trans>
              </span>
            </div>
            <div className="bg-white py-2">
              <Trans id="T for Thursday">T</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="hu for Thursday">hu</Trans>
              </span>
            </div>
            <div className="bg-white py-2">
              <Trans id="F for Friday">F</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="ri for Friday">ri</Trans>
              </span>
            </div>
            <div className="bg-white py-2">
              <Trans id="S for Saturday">S</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="at for Saturday">at</Trans>
              </span>
            </div>
            <div className="bg-white py-2">
              <Trans id="S for Sunday">S</Trans>
              <span className="sr-only sm:not-sr-only">
                <Trans id="un for Sunday">un</Trans>
              </span>
            </div>
          </div>
          <div className="flex text-xs/6 text-gray-700">
            <div className="divide-y divide-x divide-gray-200 w-full grid grid-cols-7 gap-0">
              {days.map((day, index) => (
                <div
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
                  key={day.date}
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
                  <time dateTime={day.date} className="ml-auto pr-2">
                    {day.date.split("-").pop()?.replace(/^0/, "")}
                  </time>
                  <div className="h-full w-full overflow-hidden">
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
