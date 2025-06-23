import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { classNames } from "../../utils/classNames";
import { i18n } from "@lingui/core";
import { AssignableTeamMembers } from "./AssignableTeamMembers";
import { ShiftPositionWithFake } from "../../hooks/useTeamShiftPositionsMap";
import { User } from "libs/graphql/src/types.generated";

export interface ShiftPositionMenuProps {
  teamPk: string;
  shiftPosition: ShiftPositionWithFake;
  handleEditShiftPosition?: (shiftPosition: ShiftPositionWithFake) => void;
  handleAssignShiftPosition?: (
    shiftPosition: ShiftPositionWithFake,
    member: User | null
  ) => void;
  copyShiftPositionToClipboard?: (shiftPosition: ShiftPositionWithFake) => void;
  hasCopiedShiftPosition?: boolean;
  pasteShiftPositionFromClipboard?: (day: string) => void;
  deleteShiftPosition?: (pk: string, sk: string) => void;
}

export const ShiftPositionMenu = ({
  teamPk,
  shiftPosition,
  handleEditShiftPosition,
  handleAssignShiftPosition,
  copyShiftPositionToClipboard,
  hasCopiedShiftPosition,
  pasteShiftPositionFromClipboard,
  deleteShiftPosition,
}: ShiftPositionMenuProps) => {
  return (
    <Menu
      as="div"
      className="right-0 top-0 absolute opacity-0 group-hover:opacity-100 z-200"
    >
      <MenuButton
        className="cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 rounded-sm"
        aria-label={i18n.t("Shift options menu")}
      >
        <EllipsisHorizontalIcon className="w-4 h-4" />
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        portal
        className="absolute z-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <MenuItem>
          {({ active }) => (
            <button
              onClick={() => handleEditShiftPosition?.(shiftPosition)}
              className={classNames(
                active ? "bg-gray-100" : "",
                "block w-full text-left px-4 py-2 text-sm text-gray-700"
              )}
              aria-label={i18n.t("Edit shift")}
            >
              <Trans>Edit</Trans>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <button
              onClick={() => copyShiftPositionToClipboard?.(shiftPosition)}
              className={classNames(
                active ? "bg-gray-100" : "",
                "block w-full text-left px-4 py-2 text-sm text-gray-700"
              )}
              aria-label={i18n.t("Copy shift")}
            >
              <Trans>Copy</Trans>
            </button>
          )}
        </MenuItem>
        {hasCopiedShiftPosition && (
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() =>
                  pasteShiftPositionFromClipboard?.(shiftPosition.day)
                }
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block w-full text-left px-4 py-2 text-sm text-gray-700"
                )}
                aria-label={i18n.t("Paste shift here")}
              >
                <Trans>Paste here</Trans>
              </button>
            )}
          </MenuItem>
        )}
        <MenuItem>
          {({ active }) => (
            <button
              onClick={() =>
                deleteShiftPosition?.(shiftPosition.pk, shiftPosition.sk)
              }
              className={classNames(
                active ? "bg-gray-100" : "",
                "block w-full text-left px-4 py-2 text-sm text-gray-700"
              )}
              aria-label={i18n.t("Delete shift")}
            >
              <Trans>Delete</Trans>
            </button>
          )}
        </MenuItem>
        {shiftPosition.assignedTo && (
          <MenuItem>
            <button
              onClick={() => handleAssignShiftPosition?.(shiftPosition, null)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 cursor-pointer"
              aria-label={i18n.t("Paste shift here")}
            >
              <Trans>Unassign</Trans>
            </button>
          </MenuItem>
        )}
        <MenuItem>
          {({ active }) => (
            <button
              onClick={() =>
                pasteShiftPositionFromClipboard?.(shiftPosition.day)
              }
              className="block w-full text-left px-4 py-2 text-sm text-gray-700"
              aria-label={i18n.t("Paste shift here")}
            >
              {shiftPosition.assignedTo ? (
                <Trans>Reassign</Trans>
              ) : (
                <Trans>Assign</Trans>
              )}
              {active ? (
                <AssignableTeamMembers
                  teamPk={teamPk}
                  shiftPosition={shiftPosition}
                  onSelect={(member) => {
                    handleAssignShiftPosition?.(shiftPosition, member);
                  }}
                />
              ) : (
                <></>
              )}
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
