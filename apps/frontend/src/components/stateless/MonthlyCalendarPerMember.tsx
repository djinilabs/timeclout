import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { memo, useCallback } from "react";
import { Trans } from "@lingui/react/macro";
import { Avatar } from "./Avatar";
import { months } from "../../utils/months";
import { Button } from "./Button";
import { DayDate } from "@/day-date";
import { LabeledSwitch } from "./LabeledSwitch";

export interface User {
  pk: string;
  name: string;
  email?: string | null;
  emailMd5?: string | null;
}

export interface MonthlyScheduleProps {
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  members: User[];
  renderMemberDay: (
    member: User,
    day: DayDate,
    calIndex: number
  ) => React.ReactNode;
  onAdd: () => void;
  onSwitchView: (view: "calendar" | "linear") => void;
}

export const MonthlyCalendarPerMember = memo(
  ({
    year,
    month,
    goTo,
    members,
    renderMemberDay,
    onAdd,
    onSwitchView,
  }: MonthlyScheduleProps) => {
    const handlePrevMonth = useCallback(() => {
      goTo(year, month - 1);
    }, [goTo, year, month]);

    const handleNextMonth = useCallback(() => {
      goTo(year, month + 1);
    }, [goTo, year, month]);

    const handleToday = useCallback(() => {
      goTo(new Date().getFullYear(), new Date().getMonth());
    }, [goTo]);

    const yearMonth = `${year}-${month + 1}`;
    const humanYearMonth = `${months()[month]} ${year}`;

    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <header className="flex-none flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
          <h1 className="text-base font-semibold text-gray-900">
            <time dateTime={yearMonth}>{humanYearMonth}</time>
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-white shadow-2xs md:items-stretch">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">
                  <Trans>Previous year</Trans>
                </span>
                <ChevronLeftIcon className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              >
                <Trans>Today</Trans>
              </button>
              <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50 mr-2"
              >
                <span className="sr-only">
                  <Trans>Next year</Trans>
                </span>
                <ChevronRightIcon className="size-5" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2">
                <Button onClick={onAdd}>
                  <PlusIcon className="size-5" aria-hidden="true" />
                </Button>
                <LabeledSwitch
                  label={<Trans>Switch to calendar</Trans>}
                  checked
                  onChange={(checked) => {
                    if (!checked) onSwitchView("calendar");
                  }}
                />
              </div>
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
                      onClick={handleToday}
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

        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="bg-white sticky top-0 left-0 z-20 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 border-r border-gray-300 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]"
                  >
                    <Trans>Name</Trans>
                  </th>
                  {Array.from(
                    { length: new Date(year, month + 1, 0).getDate() },
                    (_, i) => i + 1
                  ).map((day) => (
                    <th
                      key={day}
                      scope="col"
                      className="bg-white sticky top-0 z-20 px-1 py-3.5 text-center text-sm font-semibold text-gray-900 border-r border-gray-300 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members?.map((member) => (
                  <tr key={member.pk}>
                    <th className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 flex items-center gap-2 border-r border-gray-300">
                      <Avatar {...member} size={30} />
                      <span className="text-sm font-medium text-gray-600">
                        {member.name}
                      </span>
                    </th>
                    {Array.from(
                      { length: new Date(year, month + 1, 0).getDate() },
                      (_, i) => i + 1
                    ).map((dayofTheMonth, dayIndex) => {
                      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayofTheMonth).padStart(2, "0")}`;
                      const dayDate = new DayDate(date);

                      return (
                        <td
                          key={date}
                          className={`whitespace-nowrap text-sm text-center border-r border-gray-100 relative group ${
                            dayDate.isWeekend() ? "bg-gray-50" : ""
                          }`}
                        >
                          <span className="absolute top-1 right-1 text-gray-300 text-xs">
                            {dayofTheMonth}
                          </span>

                          {renderMemberDay(member, dayDate, dayIndex)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);
