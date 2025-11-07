import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { User } from "libs/graphql/src/types.generated";
import { DropdownMenu } from "radix-ui";

import { ShiftPositionWithFake } from "../../hooks/useTeamShiftPositionsMap";

import { AssignableTeamMembers } from "./AssignableTeamMembers";

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="absolute right-0 top-0 cursor-pointer group-hover:opacity-100 z-200 hover:bg-gray-200 hover:bg-opacity-10 rounded-sm"
          aria-label={i18n.t("Shift options menu")}
        >
          <EllipsisHorizontalIcon className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 min-w-[120px]"
          sideOffset={5}
        >
          <DropdownMenu.Item
            onClick={() => handleEditShiftPosition?.(shiftPosition)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label={i18n.t("Edit shift")}
          >
            <Trans>Edit</Trans>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => copyShiftPositionToClipboard?.(shiftPosition)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label={i18n.t("Copy shift")}
          >
            <Trans>Copy</Trans>
          </DropdownMenu.Item>

          {hasCopiedShiftPosition && (
            <DropdownMenu.Item
              onClick={() =>
                pasteShiftPositionFromClipboard?.(shiftPosition.day)
              }
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              aria-label={i18n.t("Paste shift here")}
            >
              <Trans>Paste here</Trans>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item
            onClick={() =>
              deleteShiftPosition?.(shiftPosition.pk, shiftPosition.sk)
            }
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label={i18n.t("Delete shift")}
          >
            <Trans>Delete</Trans>
          </DropdownMenu.Item>

          {shiftPosition.assignedTo && (
            <DropdownMenu.Item
              onClick={() => handleAssignShiftPosition?.(shiftPosition, null)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              aria-label={i18n.t("Unassign shift")}
            >
              <Trans>Unassign</Trans>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              {shiftPosition.assignedTo ? (
                <Trans>Reassign</Trans>
              ) : (
                <Trans>Assign</Trans>
              )}
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="z-300 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 min-w-[200px]"
                sideOffset={2}
                alignOffset={-5}
              >
                <AssignableTeamMembers
                  teamPk={teamPk}
                  shiftPosition={shiftPosition}
                  onSelect={(member) => {
                    handleAssignShiftPosition?.(shiftPosition, member);
                  }}
                />
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
