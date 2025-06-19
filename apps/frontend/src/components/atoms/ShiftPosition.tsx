import { memo, useEffect, useRef } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { colors } from "@/settings";
import {
  User,
  type ShiftPosition as ShiftPositionType,
} from "libs/graphql/src/types.generated";
import { classNames } from "../../utils/classNames";
import {
  type TimeSchedule,
  MiniTimeScheduleVisualizer,
} from "../particles/MiniTimeScheduleVisualizer";
import { type ShiftPositionWithFake } from "../../hooks/useTeamShiftPositionsMap";
import { Avatar } from "../particles/Avatar";
import { Popover } from "../particles/Popover";
import { toMinutes } from "../../utils/toMinutes";
import { AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { i18n } from "@lingui/core";
import { Hint } from "../particles/Hint";
import { AssignableTeamMembers } from "./AssignableTeamMembers";

export interface ShiftPositionProps {
  teamPk: string;
  shiftPosition: AnalyzedShiftPosition;
  hideName?: boolean;
  setFocusedShiftPosition?: (shiftPosition: ShiftPositionType) => void;
  focus?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  handleEditShiftPosition?: (shiftPosition: ShiftPositionWithFake) => void;
  handleAssignShiftPosition: (
    shiftPosition: ShiftPositionType,
    member: User | null
  ) => void;
  copyShiftPositionToClipboard?: (shiftPosition: ShiftPositionWithFake) => void;
  hasCopiedShiftPosition?: boolean;
  pasteShiftPositionFromClipboard?: (day: string) => void;
  deleteShiftPosition?: (pk: string, sk: string) => void;
  lastRow?: boolean;
  conflicts?: boolean;
  isSelected?: boolean;
  showScheduleDetails?: boolean;
}

const isValidNumber = (value: number | undefined): value is number =>
  value !== undefined && Number.isFinite(value) && !Number.isNaN(value);

const toHex = (n: number) => n.toString(16).padStart(2, "0");

// Helper function to get color based on deviation value
const getDeviationColor = (normalized: number | undefined): string => {
  if (normalized === undefined) return "transparent";
  const n = Math.min(1, Math.abs(normalized));

  // Interpolate between green (good) and red (bad)
  const r = Math.round(255 * n);
  const g = Math.round(255 * (1 - n));
  const b = 0;

  // Convert to hex
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Helper function to calculate average deviation
const calculateAverageDeviation = (
  deviations: (number | undefined)[]
): number | undefined => {
  const validDeviations = deviations.filter(
    (d): d is number =>
      d !== undefined && !Number.isNaN(d) && Number.isFinite(d)
  );

  if (validDeviations.length === 0) return undefined;

  const sum = validDeviations.reduce((acc, val) => acc + val, 0);
  return sum / validDeviations.length;
};

// Component to display deviation value in a circle
const DeviationCircle = ({
  value,
  label,
}: {
  invert?: boolean;
  value: number;
  label: string;
}) => {
  const n = Math.abs(value);
  const color = getDeviationColor(n);
  const percentage = Math.round(n * 100); // Convert to percentage and round to nearest integer

  return (
    <Hint hint={`${label}: ${percentage}%`}>
      <div
        className="flex items-center justify-center p-1 min-w-5 h-5 rounded-full text-[10px] font-medium text-white"
        style={{ backgroundColor: color }}
      >
        {percentage}%
      </div>
    </Hint>
  );
};

export const ShiftPosition = memo(
  ({
    teamPk,
    shiftPosition,
    hideName = false,
    setFocusedShiftPosition,
    focus,
    autoFocus,
    tabIndex,
    handleEditShiftPosition,
    handleAssignShiftPosition,
    copyShiftPositionToClipboard,
    hasCopiedShiftPosition,
    pasteShiftPositionFromClipboard,
    deleteShiftPosition,
    lastRow,
    conflicts: originalConflicts,
    isSelected,
    showScheduleDetails,
  }: ShiftPositionProps) => {
    const conflicts =
      originalConflicts ||
      shiftPosition.hasLeaveConflict ||
      shiftPosition.hasIssueWithMaximumIntervalBetweenShiftsRule ||
      shiftPosition.hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday ||
      shiftPosition.hasIssueWithMinimumRestSlotsAfterShiftRule ||
      false;

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
          role="button"
          aria-label={`${shiftPosition.name || "Shift"} on ${
            shiftPosition.day
          }`}
          aria-grabbed="false"
          onDragStart={(e) => {
            e.dataTransfer.setData(shiftPosition.sk, "");
            e.dataTransfer.dropEffect = "move";
            e.currentTarget.setAttribute("aria-grabbed", "true");
          }}
          onDragEnd={(e) => {
            e.dataTransfer.clearData();
            e.currentTarget.setAttribute("aria-grabbed", "false");
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
              ? `${focus ? "2" : "1"}px solid ${colors[shiftPosition.color]}${
                  focus || isSelected ? "ff" : "22"
                }`
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
              aria-label={i18n.t("Shift options menu")}
            >
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </MenuButton>
            <Popover placement="auto" referenceElement={menuButtonRef.current}>
              <MenuItems className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in">
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
                      onClick={() =>
                        copyShiftPositionToClipboard?.(shiftPosition)
                      }
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
                        deleteShiftPosition?.(
                          shiftPosition.pk,
                          shiftPosition.sk
                        )
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
                      onClick={(ev) => {
                        handleAssignShiftPosition?.(shiftPosition, null);
                      }}
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
            </Popover>
          </Menu>

          <div
            className="flex-auto flex items-center justify-left ml-2 overflow-hidden transition-all duration-300 ease-in"
            style={{
              marginLeft: showScheduleDetails ? `${startPercent}%` : undefined,
            }}
          >
            <div className="flex flex-col w-full">
              <div className="flex items-center">
                {shiftPosition.assignedTo && (
                  <div className="mr-1">
                    <Avatar size={25} {...shiftPosition.assignedTo} />
                  </div>
                )}
                {!hideName && (
                  <Hint hint={shiftPosition.name ?? ""}>
                    <span className="text-tiny text-gray-400 truncate text-left">
                      {shiftPosition.name}
                    </span>
                  </Hint>
                )}
                {shiftPosition.hasLeaveConflict && (
                  <Hint hint={i18n.t("Leave conflict detected")}>
                    <ExclamationTriangleIcon
                      className="w-4 h-4 text-red-500 ml-1"
                      aria-label={i18n.t("Leave conflict detected")}
                      role="img"
                    />
                  </Hint>
                )}
                {shiftPosition.hasIssueWithMaximumIntervalBetweenShiftsRule && (
                  <Hint
                    hint={i18n.t(
                      "Maximum interval between shifts rule violated"
                    )}
                  >
                    <ExclamationTriangleIcon
                      className="w-4 h-4 text-yellow-500 ml-1"
                      aria-label={i18n.t(
                        "Maximum interval between shifts rule violated"
                      )}
                      role="img"
                    />
                  </Hint>
                )}
                {shiftPosition.hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday && (
                  <Hint
                    hint={i18n.t(
                      "Minimum number of shifts per week in standard workday rule violated"
                    )}
                  >
                    <ExclamationTriangleIcon
                      className="w-4 h-4 text-orange-500 ml-1"
                      aria-label={i18n.t(
                        "Minimum number of shifts per week in standard workday rule violated"
                      )}
                      role="img"
                    />
                  </Hint>
                )}
                {shiftPosition.hasIssueWithMinimumRestSlotsAfterShiftRule && (
                  <Hint
                    hint={i18n.t(
                      "Minimum rest slots after shift rule violated"
                    )}
                  >
                    <ExclamationTriangleIcon
                      className="w-4 h-4 text-purple-500 ml-1"
                      aria-label={i18n.t(
                        "Minimum rest slots after shift rule violated"
                      )}
                      role="img"
                    />
                  </Hint>
                )}
              </div>

              <Transition
                show={
                  isValidNumber(
                    shiftPosition.workerInconvenienceEqualityDeviation
                  ) ||
                  isValidNumber(shiftPosition.workerSlotEqualityDeviation) ||
                  isValidNumber(shiftPosition.workerSlotProximityDeviation)
                }
                appear
              >
                {
                  <div
                    className="flex items-center mt-1 p-1 rounded transition-all duration-300 ease-in data-[closed]:opacity-0"
                    style={{
                      backgroundColor:
                        getDeviationColor(
                          calculateAverageDeviation([
                            shiftPosition.workerInconvenienceEqualityDeviation,
                            shiftPosition.workerSlotEqualityDeviation,
                            shiftPosition.workerSlotProximityDeviation
                              ? -shiftPosition.workerSlotProximityDeviation
                              : undefined,
                          ])
                        ) + "66", // Adding 22 for 13% opacity
                    }}
                  >
                    {isValidNumber(
                      shiftPosition.workerInconvenienceEqualityDeviation
                    ) && (
                      <div className="mr-1">
                        <DeviationCircle
                          value={
                            shiftPosition.workerInconvenienceEqualityDeviation as number
                          }
                          label={i18n.t("Inconvenience Equality Deviation")}
                        />
                      </div>
                    )}
                    {isValidNumber(
                      shiftPosition.workerSlotEqualityDeviation
                    ) && (
                      <div className="mr-1">
                        <DeviationCircle
                          value={
                            shiftPosition.workerSlotEqualityDeviation as number
                          }
                          label={i18n.t("Slot Equality Deviation")}
                        />
                      </div>
                    )}
                    {isValidNumber(
                      shiftPosition.workerSlotProximityDeviation
                    ) && (
                      <div className="mr-1">
                        <DeviationCircle
                          invert
                          value={
                            shiftPosition.workerSlotProximityDeviation as number
                          }
                          label={i18n.t("Slot Proximity Equality Deviation")}
                        />
                      </div>
                    )}
                  </div>
                }
              </Transition>
            </div>
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
