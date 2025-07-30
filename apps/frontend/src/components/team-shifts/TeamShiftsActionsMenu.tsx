import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PlusIcon,
  UserPlusIcon,
  SparklesIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";

export interface TeamShiftsActionsMenuProps {
  onAddPosition: () => void;
  onAutoFill: () => void;
  onUnassignPositions: () => void;
}

export const TeamShiftsActionsMenu = ({
  onAddPosition,
  onAutoFill,
  onUnassignPositions,
}: TeamShiftsActionsMenuProps) => {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="relative inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 hover:scale-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:hover:scale-100 transition duration-300"
        aria-label={i18n.t("Open actions menu")}
      >
        <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
        <Trans>Actions</Trans>
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-100 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
        aria-label="Actions menu"
      >
        <MenuItem
          as="button"
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          onClick={onAddPosition}
        >
          <UserPlusIcon className="h-4 w-4 mr-2 inline" aria-hidden="true" />
          <Trans>Add position</Trans>
        </MenuItem>
        <MenuItem
          as="button"
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          onClick={onAutoFill}
        >
          <SparklesIcon className="h-4 w-4 mr-2 inline" aria-hidden="true" />
          <Trans>Auto fill</Trans>
        </MenuItem>
        <MenuItem
          as="button"
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          onClick={onUnassignPositions}
        >
          <UserMinusIcon className="h-4 w-4 mr-2 inline" aria-hidden="true" />
          <Trans>Unassign positions</Trans>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
