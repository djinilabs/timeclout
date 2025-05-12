import { memo, useEffect, useRef } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { colors } from "@/settings";
import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { Avatar } from "./Avatar";
import { classNames } from "../../utils/classNames";
import {
  type TimeSchedule,
  MiniTimeScheduleVisualizer,
} from "./MiniTimeScheduleVisualizer";
import {
  ShiftPositionWithRowSpan,
  type ShiftPositionWithFake,
} from "../../hooks/useTeamShiftPositionsMap";
import { Popover } from "./Popover";
import { toMinutes } from "../../utils/toMinutes";

export interface ShiftPositionProps {
  shiftPosition: ShiftPositionWithRowSpan;
  hideName?: boolean;
  setFocusedShiftPosition?: (shiftPosition: ShiftPositionType) => void;
  focus?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  handleEditShiftPosition?: (shiftPosition: ShiftPositionWithFake) => void;
  copyShiftPositionToClipboard?: (shiftPosition: ShiftPositionWithFake) => void;
  hasCopiedShiftPosition?: boolean;
  pasteShiftPositionFromClipboard?: (day: string) => void;
  deleteShiftPosition?: (pk: string, sk: string) => void;
  lastRow?: boolean;
  conflicts?: boolean;
  isSelected?: boolean;
  showScheduleDetails?: boolean;
}

const isValidNumber = (value: number | undefined) =>
  value && Number.isFinite(value) && !Number.isNaN(value);

export const ShiftPosition = memo(
  ({
    shiftPosition,
    hideName = false,
    setFocusedShiftPosition,
    focus,
    autoFocus,
    tabIndex,
    handleEditShiftPosition,
    copyShiftPositionToClipboard,
    hasCopiedShiftPosition,
    pasteShiftPositionFromClipboard,
    deleteShiftPosition,
    lastRow,
    conflicts,
    isSelected,
    showScheduleDetails,
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
            "rounded-sm group relative items-center justify-center cursor-grab active:cursor-grabbing h-full w-full",
            shiftPosition.fake && "opacity-50",
            "hover:ring-2 hover:ring-gray-200",
            "outline-hidden",
            conflicts &&
              "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef444422_10px,#ef444422_20px)]"
          )}
          style={{
            backgroundColor: shiftPosition.color
              ? `${colors[shiftPosition.color]}${isSelected ? "88" : "22"}`
              : undefined,
            border: shiftPosition.color
              ? `${focus ? "2" : "1"}px solid ${colors[shiftPosition.color]}${focus || isSelected ? "ff" : "22"}`
              : undefined,
            borderBottom:
              focus || lastRow ? undefined : `1px solid rgb(243 244 246)`,
          }}
        >
          <Menu
            as="div"
            className="right-0 top-0 absolute opacity-0 group-hover:opacity-100 z-200"
          >
            <MenuButton
              ref={menuButtonRef}
              className="cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 rounded-sm"
            >
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </MenuButton>
            <Popover placement="auto" referenceElement={menuButtonRef.current}>
              <MenuItems className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => handleEditShiftPosition?.(shiftPosition)}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      <Trans>Edit</Trans>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        copyShiftPositionToClipboard?.(shiftPosition)
                      }
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
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
                        deleteShiftPosition?.(
                          shiftPosition.pk,
                          shiftPosition.sk
                        )
                      }
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      <Trans>Delete</Trans>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Popover>
          </Menu>

          <div
            className="flex-auto flex items-center justify-left ml-2 overflow-hidden transition-all duration-300 ease-in"
            style={{
              marginLeft: showScheduleDetails ? `${startPercent}%` : undefined,
            }}
          >
            {shiftPosition.assignedTo && (
              <div className="mr-1">
                <Avatar size={25} {...shiftPosition.assignedTo} />
              </div>
            )}
            {!hideName && (
              <span
                title={shiftPosition.name ?? ""}
                className="text-tiny text-gray-400 truncate text-left"
              >
                {shiftPosition.name}
              </span>
            )}
          </div>
          <Transition show={showScheduleDetails} appear>
            <div className="transition-all duration-300 ease-in data-[closed]:opacity-0">
              <MiniTimeScheduleVisualizer
                schedules={schedules as Array<TimeSchedule>}
              />
            </div>
          </Transition>
        </div>
      </>
    );
  }
);
