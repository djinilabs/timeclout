import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FC, memo, ReactNode, useCallback } from "react";
import { Trans } from "@lingui/react/macro";
import { months } from "../../utils/months";
import { Button } from "../particles/Button";

export interface CalendarHeaderProps {
  year: number;
  month: number;
  monthIsZeroBased?: boolean;
  goTo?: (year: number, month: number) => void;
  additionalActions?: Array<
    | {
        type: "button";
        text: ReactNode;
        label?: string;
        onClick: () => void;
      }
    | {
        type: "component";
        component: ReactNode;
      }
  >;
}

export const CalendarHeader: FC<CalendarHeaderProps> = memo(
  ({
    year,
    month,
    monthIsZeroBased = true,
    goTo,
    additionalActions,
  }: CalendarHeaderProps) => {
    const handlePrevMonth = useCallback(() => {
      goTo?.(year, month - 1);
    }, [goTo, year, month]);

    const handleNextMonth = useCallback(() => {
      goTo?.(year, month + 1);
    }, [goTo, year, month]);

    const handleToday = useCallback(() => {
      goTo?.(new Date().getFullYear(), new Date().getMonth());
    }, [goTo]);

    const humanMonth = `${
      months()[monthIsZeroBased ? month : month - 1]
    } ${year}`;

    return (
      <header
        key="calendar-header"
        className="flex items-center justify-between px-6 py-4 flex-none"
      >
        <h1
          key="calendar-title"
          className="text-base font-semibold text-gray-900"
        >
          <time
            aria-description={humanMonth}
            dateTime={`${year}-${monthIsZeroBased ? month + 1 : month}`}
          >
            {humanMonth}
          </time>
        </h1>
        <div key="calendar-controls" className="flex items-center">
          {goTo && (
            <div
              key="month-nav"
              className="relative flex items-center rounded-md bg-white shadow-2xs"
            >
              <button
                type="button"
                key="prev-month"
                onClick={handlePrevMonth}
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                aria-label="Previous month"
                aria-clickable
                role="button"
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
                aria-label="Go to today"
                aria-clickable
                role="button"
              >
                <Trans>Today</Trans>
              </button>
              <span
                key="divider"
                className="relative -mx-px h-5 w-px bg-gray-300 md:hidden"
              />
              <button
                type="button"
                key="next-month"
                onClick={handleNextMonth}
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                aria-label="Next month"
                aria-clickable
                role="button"
              >
                <span className="sr-only">
                  <Trans>Next month</Trans>
                </span>
                <ChevronRightIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
          <div
            key="desktop-actions"
            className="hidden md:ml-4 md:flex md:items-center"
            role="toolbar"
            aria-label="Calendar actions"
          >
            {additionalActions?.map((action, index) => (
              <div key={`desktop-action-${index}`} className="ml-6">
                {action.type === "button" ? (
                  <Button
                    aria-label={
                      action.label ??
                      (typeof action.text === "string"
                        ? action.text
                        : undefined)
                    }
                    onClick={action.onClick}
                  >
                    {action.text}
                  </Button>
                ) : (
                  action.component
                )}
              </div>
            ))}
          </div>
          <Menu
            as="div"
            key="mobile-menu"
            className="relative ml-6 md:hidden"
            aria-hidden="true"
          >
            <MenuButton
              className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500"
              aria-label="Open calendar actions menu"
              aria-clickable
              role="button"
            >
              <span className="sr-only">
                <Trans>Open menu</Trans>
              </span>
              <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              aria-label="Calendar actions menu"
            >
              <div key="mobile-actions" className="py-1">
                {additionalActions?.map((action, index) =>
                  action.type === "component" ? (
                    <MenuItem key={`mobile-component-${index}`}>
                      {action.component}
                    </MenuItem>
                  ) : (
                    <MenuItem key={`mobile-action-${index}`}>
                      <a
                        onClick={action.onClick}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        role="menuitem"
                        aria-label={
                          typeof action.text === "string"
                            ? action.text
                            : undefined
                        }
                      >
                        {action.text}
                      </a>
                    </MenuItem>
                  )
                )}
              </div>
              {goTo && (
                <div key="mobile-today" className="py-1">
                  <MenuItem>
                    <a
                      onClick={() =>
                        goTo?.(new Date().getFullYear(), new Date().getMonth())
                      }
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      role="menuitem"
                      aria-label="Go to today"
                      aria-clickable
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
    );
  }
);
