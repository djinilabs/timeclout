import { Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import {
  User,
  type ShiftPosition as ShiftPositionType,
} from "libs/graphql/src/types.generated";
import { memo, useCallback, useEffect, useRef } from "react";

import { AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { type ShiftPositionWithFake } from "../../hooks/useTeamShiftPositionsMap";
import { classNames } from "../../utils/classNames";
import { toMinutes } from "../../utils/toMinutes";
import { Avatar } from "../particles/Avatar";
import { Hint } from "../particles/Hint";
import {
  type TimeSchedule,
  MiniTimeScheduleVisualizer,
} from "../particles/MiniTimeScheduleVisualizer";

import { ShiftPositionMenu } from "./ShiftPositionMenu";

import { colors } from "@/settings";

export interface ShiftPositionProperties {
  teamPk: string;
  shiftPosition: AnalyzedShiftPosition;
  hideName?: boolean;
  setFocusedShiftPosition?: (shiftPosition: ShiftPositionType) => void;
  focus?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  handleEditShiftPosition?: (shiftPosition: ShiftPositionWithFake) => void;
  handleAssignShiftPosition?: (
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
  showMenu?: boolean;
  marginLeftAccordingToSchedule?: boolean;
  onShiftPositionDragStart?: (
    shiftPosition: ShiftPositionWithFake,
    e: React.DragEvent<HTMLDivElement>
  ) => void;
  onShiftPositionDragEnd?: (
    shiftPosition: ShiftPositionWithFake,
    e: React.DragEvent<HTMLDivElement>
  ) => void;
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

  const sum = validDeviations.reduce((accumulator, value) => accumulator + value, 0);
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
    showMenu = true,
    marginLeftAccordingToSchedule = true,
    onShiftPositionDragStart,
    onShiftPositionDragEnd,
  }: ShiftPositionProperties) => {
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
      schedules.at(-1).endHourMinutes as [number, number]
    );
    const totalMinutes = latestTime;
    const startPercent = Math.round((startTime / totalMinutes) * 100);

    const reference = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const persistFocus = (tries = 0) => {
        if (reference.current) {
          if (!reference.current.contains(document.activeElement)) {
            reference.current.focus();
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

    const draggable =
      onShiftPositionDragStart != undefined || onShiftPositionDragEnd != undefined;

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        onShiftPositionDragStart?.(shiftPosition, e);
      },
      [onShiftPositionDragStart, shiftPosition]
    );

    const onDragEnd = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        onShiftPositionDragEnd?.(shiftPosition, e);
      },
      [onShiftPositionDragEnd, shiftPosition]
    );

    const rowSpan =
      isValidNumber(shiftPosition.rowStart) &&
      isValidNumber(shiftPosition.rowEnd)
        ? shiftPosition.rowEnd - shiftPosition.rowStart + 1
        : 1;

    return (
      <>
        {Array.from({ length: rowSpan - 1 }).map((_, index) => (
          <div key={index} className="h-full w-full"></div>
        ))}
        <div
          ref={reference}
          onFocus={() => setFocusedShiftPosition?.(shiftPosition)}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          draggable={draggable}
          role="button"
          aria-label={`${shiftPosition.name || "Shift"} on ${
            shiftPosition.day
          }`}
          aria-grabbed="false"
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className={classNames(
            "rounded-sm group relative items-center justify-center active:cursor-grabbing h-full overflow-hidden",
            draggable && "cursor-grab",
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
          {showMenu && (
            <ShiftPositionMenu
              teamPk={teamPk}
              shiftPosition={shiftPosition}
              handleAssignShiftPosition={handleAssignShiftPosition}
              handleEditShiftPosition={handleEditShiftPosition}
              copyShiftPositionToClipboard={copyShiftPositionToClipboard}
              hasCopiedShiftPosition={hasCopiedShiftPosition}
              pasteShiftPositionFromClipboard={pasteShiftPositionFromClipboard}
              deleteShiftPosition={deleteShiftPosition}
            />
          )}

          <div
            className="flex-auto flex items-center justify-left ml-2 overflow-hidden transition-all duration-300 ease-in w-full"
            style={{
              marginLeft:
                showScheduleDetails && marginLeftAccordingToSchedule
                  ? `${startPercent}%`
                  : undefined,
            }}
          >
            <div className="flex flex-col w-full overflow-hidden">
              <div className="flex flex-row items-center w-full overflow-hidden min-w-0">
                {shiftPosition.assignedTo && (
                  <div className="mr-1 flex-shrink-0">
                    <Avatar size={25} {...shiftPosition.assignedTo} />
                  </div>
                )}
                {!hideName && (
                  <Hint
                    as="span"
                    className="text-tiny text-gray-400 truncate text-left overflow-hidden flex-1 min-w-0"
                    hint={shiftPosition.name ?? ""}
                  >
                    {shiftPosition.name}
                  </Hint>
                )}
              </div>
              {/* Conflicts */}
              {conflicts && (
                <div className="flex flex-row items-center">
                  {shiftPosition.hasLeaveConflict && (
                    <Hint hint={i18n.t("Leave conflict detected")}>
                      <ExclamationTriangleIcon
                        className="w-4 h-4 text-red-500 ml-1 flex-shrink-0"
                        aria-label={i18n.t("Leave conflict detected")}
                        role="img"
                      />
                    </Hint>
                  )}
                  {shiftPosition.hasIssueWithMaximumIntervalBetweenShiftsRule && (
                    <Hint
                      as="span"
                      hint={i18n.t(
                        "Maximum interval between shifts rule violated"
                      )}
                    >
                      <ExclamationTriangleIcon
                        className="w-4 h-4 text-yellow-500 ml-1 flex-shrink-0"
                        aria-label={i18n.t(
                          "Maximum interval between shifts rule violated"
                        )}
                        role="img"
                      />
                    </Hint>
                  )}
                  {shiftPosition.hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday && (
                    <Hint
                      as="span"
                      hint={i18n.t(
                        "Minimum number of shifts per week in standard workday rule violated"
                      )}
                    >
                      <ExclamationTriangleIcon
                        className="w-4 h-4 text-orange-500 ml-1 flex-shrink-0"
                        aria-label={i18n.t(
                          "Minimum number of shifts per week in standard workday rule violated"
                        )}
                        role="img"
                      />
                    </Hint>
                  )}
                  {shiftPosition.hasIssueWithMinimumRestSlotsAfterShiftRule && (
                    <Hint
                      as="span"
                      hint={i18n.t(
                        "Minimum rest slots after shift rule violated"
                      )}
                    >
                      <ExclamationTriangleIcon
                        className="w-4 h-4 text-purple-500 ml-1 flex-shrink-0"
                        aria-label={i18n.t(
                          "Minimum rest slots after shift rule violated"
                        )}
                        role="img"
                      />
                    </Hint>
                  )}
                </div>
              )}

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
                marginLeftAccordingToSchedule={marginLeftAccordingToSchedule}
              />
            </div>
          </Transition>
        </div>
      </>
    );
  }
);

ShiftPosition.displayName = "ShiftPosition";
