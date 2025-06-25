import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { LabeledSwitch } from "../particles/LabeledSwitch";

export interface TeamShiftsScheduleOptionsMenuProps {
  showLeaveSchedule: boolean;
  setShowLeaveSchedule: (show: boolean) => void;
  showScheduleDetails: boolean;
  setShowScheduleDetails: (show: boolean) => void;
  analyze: boolean;
  setAnalyze: (analyze: boolean) => void;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showDayTemplates: boolean;
  setShowDayTemplates: (show: boolean) => void;
}

export const TeamShiftsScheduleOptionsMenu = ({
  showLeaveSchedule,
  setShowLeaveSchedule,
  showScheduleDetails,
  setShowScheduleDetails,
  analyze,
  setAnalyze,
  showTemplates,
  setShowTemplates,
  showDayTemplates,
  setShowDayTemplates,
}: TeamShiftsScheduleOptionsMenuProps) => {
  return (
    <Menu as="div" className="relative z-500">
      <MenuButton
        className="relative inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 hover:scale-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:hover:scale-100 transition duration-300"
        aria-label={i18n.t("Open schedule options menu")}
      >
        <Trans>Options</Trans>
        <EllipsisHorizontalIcon className="h-4 w-4" aria-hidden="true" />
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
        aria-label="Schedule options menu"
      >
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            <Trans>Display Options</Trans>
          </h3>
          <div className="space-y-3">
            <MenuItem as="div" className="cursor-default">
              <LabeledSwitch
                label={
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <Trans>Leaves</Trans>
                  </div>
                }
                checked={showLeaveSchedule}
                onChange={setShowLeaveSchedule}
                aria-label="Toggle leave schedule visibility"
              />
            </MenuItem>
            <MenuItem as="div" className="cursor-default">
              <LabeledSwitch
                label={
                  <div className="flex items-center gap-2">
                    <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    <Trans>Details</Trans>
                  </div>
                }
                checked={showScheduleDetails}
                onChange={setShowScheduleDetails}
                aria-label="Toggle schedule details visibility"
              />
            </MenuItem>
            <MenuItem as="div" className="cursor-default">
              <LabeledSwitch
                label={
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4 text-gray-500" />
                    <Trans>Analyze</Trans>
                  </div>
                }
                checked={analyze}
                onChange={setAnalyze}
                aria-label="Toggle schedule analysis"
              />
            </MenuItem>
            <MenuItem as="div" className="cursor-default">
              <LabeledSwitch
                label={
                  <div className="flex items-center gap-2">
                    <DocumentDuplicateIcon className="h-4 w-4 text-gray-500" />
                    <Trans>Position Templates</Trans>
                  </div>
                }
                checked={showTemplates}
                onChange={setShowTemplates}
                aria-label="Toggle schedule templates visibility"
              />
            </MenuItem>
            <MenuItem as="div" className="cursor-default">
              <LabeledSwitch
                label={
                  <div className="flex items-center gap-2">
                    <DocumentDuplicateIcon className="h-4 w-4 text-gray-500" />
                    <Trans>Day Templates</Trans>
                  </div>
                }
                checked={showDayTemplates}
                onChange={setShowDayTemplates}
                aria-label="Toggle schedule day templates visibility"
              />
            </MenuItem>
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
};
