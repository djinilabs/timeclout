import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FC, memo, useCallback } from "react";
import { Trans } from "@lingui/react/macro";
import { months } from "../../utils/months";
import { Button } from "./Button";

export interface CalendarHeaderProps {
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  onAdd?: () => unknown;
  onSwitchView?: (view: "calendar" | "linear") => unknown;
}

export const CalendarHeader: FC<CalendarHeaderProps> = memo(
  ({ year, month, goTo, onAdd, onSwitchView }: CalendarHeaderProps) => {
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
      <header className="no-print flex-none flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
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
              {onSwitchView && (
                <Button onClick={() => onSwitchView("calendar")}>
                  <Trans>Switch to calendar</Trans>
                </Button>
              )}
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
    );
  }
);
