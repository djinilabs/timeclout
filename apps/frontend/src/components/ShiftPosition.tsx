import { FC, memo, useEffect, useRef } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { Avatar } from "./Avatar";
import { classNames } from "../utils/classNames";
import {
  type TimeSchedule,
  MiniTimeScheduleVisualizer,
} from "./MiniTimeScheduleVisualizer";
import { type ShiftPositionWithFake } from "../hooks/useTeamShiftPositionsMap";
import { colors } from "@/settings";
import { Popover } from "./Popover";

export interface ShiftPositionProps {
  shiftPosition: ShiftPositionWithFake;
  setFocusedShiftPosition?: (shiftPosition: ShiftPositionType) => void;
  focus: boolean;
  autoFocus?: boolean;
  tabIndex: number;
  handleEditShiftPosition: (shiftPosition: ShiftPositionWithFake) => void;
  copyShiftPositionToClipboard: (shiftPosition: ShiftPositionWithFake) => void;
  hasCopiedShiftPosition: boolean;
  pasteShiftPositionFromClipboard: (day: string) => void;
  deleteShiftPosition: (pk: string, sk: string) => void;
}

const toMinutes = ([hours, minutes]: [number, number]) => {
  return hours * 60 + minutes;
};

const isValidNumber = (value: number | undefined) =>
  value && Number.isFinite(value) && !Number.isNaN(value);

export const ShiftPosition = memo(
  ({
    shiftPosition,
    setFocusedShiftPosition,
    focus,
    autoFocus,
    tabIndex,
    handleEditShiftPosition,
    copyShiftPositionToClipboard,
    hasCopiedShiftPosition,
    pasteShiftPositionFromClipboard,
    deleteShiftPosition,
  }: ShiftPositionProps) => {
    const { schedules } = shiftPosition;
    const startTime = toMinutes(
      schedules[0].startHourMinutes as [number, number]
    );
    const latestTime = toMinutes(
      schedules[schedules.length - 1].endHourMinutes as [number, number]
    );
    const totalMinutes = latestTime;
    const startPercent = Math.round((startTime / totalMinutes) * 100);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const persistFocus = (tries = 0) => {
        if (ref.current) {
          if (!ref.current.contains(document.activeElement)) {
            ref.current.focus();
          }
        } else if (tries < 5) {
          setTimeout(() => {
            persistFocus(tries + 1);
          }, 100);
        }
      };
      if (focus) {
        persistFocus();
      }
    }, [focus, shiftPosition.day]);

    const rowSpan =
      isValidNumber(shiftPosition.rowStart) &&
      isValidNumber(shiftPosition.rowEnd)
        ? shiftPosition.rowEnd - shiftPosition.rowStart + 1
        : 1;

    const menuButtonRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        {Array.from({ length: rowSpan - 1 }).map((_, index) => (
          <div key={index} className="h-full w-full"></div>
        ))}
        <div
          ref={ref}
          onFocus={() => setFocusedShiftPosition?.(shiftPosition)}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(shiftPosition.sk, "");
            e.dataTransfer.dropEffect = "move";
          }}
          onDragEnd={(e) => {
            e.dataTransfer.clearData();
          }}
          className={classNames(
            "group relative items-center justify-center cursor-grab active:cursor-grabbing h-full w-full py-1",
            shiftPosition.fake && "opacity-50",
            "hover:ring-2 hover:ring-gray-200",
            "outline-none focus:border-2 focus:border-blue-300"
          )}
          style={{
            backgroundColor: shiftPosition.color
              ? `${colors[shiftPosition.color]}22`
              : undefined,
          }}
        >
          <Menu
            as="div"
            className="right-0 top-0 absolute opacity-0 group-hover:opacity-100 z-[200]"
          >
            <MenuButton
              ref={menuButtonRef}
              className="cursor-pointer hover:bg-black hover:bg-opacity-10 rounded"
            >
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </MenuButton>
            <Popover placement="top" referenceElement={menuButtonRef.current}>
              <MenuItems className="absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => handleEditShiftPosition(shiftPosition)}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Edit
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        copyShiftPositionToClipboard(shiftPosition)
                      }
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Copy
                    </button>
                  )}
                </MenuItem>
                {hasCopiedShiftPosition && (
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          pasteShiftPositionFromClipboard(shiftPosition.day)
                        }
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Paste here
                      </button>
                    )}
                  </MenuItem>
                )}
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        deleteShiftPosition(shiftPosition.pk, shiftPosition.sk)
                      }
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Delete
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Popover>
          </Menu>

          <div
            className="flex-auto flex items-center justify-left ml-2 overflow-hidden"
            style={{
              marginLeft: `${startPercent}%`,
            }}
          >
            {shiftPosition.assignedTo && (
              <div className="mr-1">
                <Avatar size={25} {...shiftPosition.assignedTo} />
              </div>
            )}
            <span
              title={shiftPosition.name ?? ""}
              className="text-tiny text-gray-400 truncate text-left"
            >
              {shiftPosition.name}
            </span>
          </div>
          <MiniTimeScheduleVisualizer
            schedules={schedules as Array<TimeSchedule>}
          />
        </div>
      </>
    );
  }
);
