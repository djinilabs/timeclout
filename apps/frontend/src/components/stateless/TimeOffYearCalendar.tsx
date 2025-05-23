import { memo, useMemo, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Trans } from "@lingui/react/macro";
import { generateYearMonthsDays } from "../../utils/generateYearMonthsDays";
import { TimeOffCalendarDay } from "./TimeOffCalendarDay";
import { LeaveDay } from "../types";

export interface YearCalendarProps {
  year: number;
  goToYear: (year: number) => void;
  bookTimeOff: () => void;
  calendarDateMap: Record<string, LeaveDay>;
  holidays?: Record<string, string>;
}

export const TimeOffYearCalendar = memo(
  ({
    year,
    goToYear,
    bookTimeOff,
    calendarDateMap,
    holidays,
  }: YearCalendarProps) => {
    const months = useMemo(() => generateYearMonthsDays(year), [year]);
    const [hoveringDay, setHoveringDay] = useState<string | null>(null);
    return (
      <div>
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h1 className="text-base font-semibold text-gray-900">
            <time dateTime={year.toString()}>{year}</time>
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-white shadow-2xs md:items-stretch">
              <button
                type="button"
                onClick={() => goToYear(year - 1)}
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">
                  <Trans>Previous year</Trans>
                </span>
                <ChevronLeftIcon className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goToYear(new Date().getFullYear())}
                className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              >
                <Trans>Today</Trans>
              </button>
              <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
              <button
                type="button"
                onClick={() => goToYear(year + 1)}
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">
                  <Trans>Next year</Trans>
                </span>
                <ChevronRightIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="ml-6 h-6 w-px bg-gray-300" />
              <button
                type="button"
                className="ml-6 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                onClick={bookTimeOff}
              >
                <Trans>Request Time Off</Trans>
              </button>
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
                  <MenuItem>
                    <a
                      onClick={bookTimeOff}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      <Trans>Request time off</Trans>
                    </a>
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    <a
                      onClick={() => goToYear(new Date().getFullYear())}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      <Trans>Go to today</Trans>
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </header>
        <div className="bg-white">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4">
            {months.map((month) => (
              <section key={`${year}-${month.name}`} className="text-center">
                <h2 className="text-sm font-semibold text-gray-900">
                  {month.name}
                </h2>
                <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500">
                  <div>
                    <Trans>M</Trans>
                  </div>
                  <div>
                    <Trans>T</Trans>
                  </div>
                  <div>
                    <Trans>W</Trans>
                  </div>
                  <div>
                    <Trans>T</Trans>
                  </div>
                  <div>
                    <Trans>F</Trans>
                  </div>
                  <div>
                    <Trans>S</Trans>
                  </div>
                  <div>
                    <Trans>S</Trans>
                  </div>
                </div>
                <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm ring-1 shadow-xs ring-gray-200">
                  {month.days.map((day, dayIdx) => {
                    const isLeave = calendarDateMap[day.date];
                    const isHovering = hoveringDay === day.date;
                    return (
                      <TimeOffCalendarDay
                        key={day.date}
                        day={day}
                        dayIdx={dayIdx}
                        month={month}
                        isLeave={isLeave}
                        isHovering={isHovering}
                        setHoveringDay={setHoveringDay}
                        holiday={holidays?.[day.date]}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
