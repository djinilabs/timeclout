import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Button } from "./Button";
import { FC, memo, useCallback } from "react";
import { classNames } from "../../utils/classNames";
import { months } from "../../utils/months";

export interface Day {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
}

export interface MonthCalendarProps {
  addButtonText: string;
  autoFillButtonText: string;
  onAddPosition: () => void;
  onAutoFill: () => void;
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  days: Array<Day>;
  renderDay: (day: Day, calIndex: number) => React.ReactNode;
  onCellDrop?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragEnter?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragLeave?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onCellDragOver?: (day: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDayFocus?: (day: string) => void;
}

export const MonthCalendar: FC<MonthCalendarProps> = memo(
  ({
    addButtonText,
    autoFillButtonText,
    onAddPosition,
    onAutoFill,
    year,
    month,
    days,
    goTo,
    renderDay,
    onCellDrop,
    onCellDragEnter,
    onCellDragLeave,
    onCellDragOver,
    onDayFocus,
  }) => {
    const handlePrevMonth = useCallback(() => {
      goTo(year, month - 1);
    }, [goTo, year, month]);

    const handleNextMonth = useCallback(() => {
      goTo(year, month + 1);
    }, [goTo, year, month]);

    const handleToday = useCallback(() => {
      goTo(new Date().getFullYear(), new Date().getMonth());
    }, [goTo]);

    return (
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between px-6 py-4 flex-none">
          <h1 className="text-base font-semibold text-gray-900">
            <time dateTime={`${year}-${month + 1}`}>
              {months[month]} {year}
            </time>
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-white shadow-xs items-stretch">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              >
                Today
              </button>
              <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="ml-6 h-6 w-px bg-gray-300" />
              <Button onClick={() => onAddPosition()}>{addButtonText}</Button>
              <div className="ml-6 h-6 w-px bg-gray-300" />
              <Button onClick={() => onAutoFill()}>{autoFillButtonText}</Button>
            </div>
            <Menu as="div" className="relative ml-6 md:hidden">
              <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open menu</span>
                <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      onClick={onAddPosition}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      {addButtonText}
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      onClick={onAutoFill}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      {autoFillButtonText}
                    </a>
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    <a
                      onClick={() =>
                        goTo(new Date().getFullYear(), new Date().getMonth())
                      }
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Go to today
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </header>
        <div className="ring-1 shadow-sm ring-black/5 flex flex-auto flex-col rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 flex-none">
            <div className="bg-white py-2">
              M<span className="sr-only sm:not-sr-only">on</span>
            </div>
            <div className="bg-white py-2">
              T<span className="sr-only sm:not-sr-only">ue</span>
            </div>
            <div className="bg-white py-2">
              W<span className="sr-only sm:not-sr-only">ed</span>
            </div>
            <div className="bg-white py-2">
              T<span className="sr-only sm:not-sr-only">hu</span>
            </div>
            <div className="bg-white py-2">
              F<span className="sr-only sm:not-sr-only">ri</span>
            </div>
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">at</span>
            </div>
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">un</span>
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
                    (day.isSelected || day.isToday) && "font-semibold",
                    day.isSelected && "text-white",
                    !day.isSelected && day.isToday && "text-teal-600",
                    !day.isSelected &&
                      day.isCurrentMonth &&
                      !day.isToday &&
                      "text-gray-900",
                    !day.isSelected &&
                      !day.isCurrentMonth &&
                      !day.isToday &&
                      "text-gray-500",
                    "flex flex-col py-2 min-h-[8rem]"
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      day.isSelected &&
                        "flex size-6 items-center justify-right rounded-full",
                      day.isSelected && day.isToday && "bg-teal-600",
                      day.isSelected && !day.isToday && "bg-gray-900",
                      "ml-auto pr-2"
                    )}
                  >
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
