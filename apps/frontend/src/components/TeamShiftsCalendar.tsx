import { useCallback, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { DayDate, DayDateInterval } from "@/day-date";
import { Dialog } from "./stateless/Dialog";
import { MonthCalendar } from "./stateless/MonthCalendar";
import { CreateOrEditScheduleShiftPosition } from "./CreateOrEditScheduleShiftPosition";
import { Suspense } from "./stateless/Suspense";
import { useTeamShiftActions } from "../hooks/useTeamShiftActions";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { getDefined } from "@/utils";
import { useTeamShiftsDragAndDrop } from "../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsClipboard } from "../hooks/useTeamShiftsClipboard";
import { ShiftPosition } from "./stateless/ShiftPosition";
import { useTeamShiftsFocusNavigation } from "../hooks/useTeamShiftsFocusNavigation";
import {
  type ShiftPositionWithFake,
  useTeamShiftPositionsMap,
} from "../hooks/useTeamShiftPositionsMap";
import { classNames } from "../utils/classNames";
import { ShiftPosition as ShiftPositionType } from "../graphql/graphql";
import { ShiftsAutoFill } from "./ShiftsAutoFill";
import { useTeamLeaveSchedule } from "../hooks/useTeamLeaveSchedule";
import { Avatar } from "./stateless/Avatar";
import { useLocalPreference } from "../hooks/useLocalPreference";
import { LabeledSwitch } from "./stateless/LabeledSwitch";

export const TeamShiftsCalendar = () => {
  const { team, company } = useParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [autoFillDialogOpen, setAutoFillDialogOpen] = useState(false);

  const [params, setParams] = useSearchParams();
  const selectedMonth = useMemo(() => {
    const month = params.get("month");
    if (!month) {
      return DayDate.today();
    }
    return new DayDate(month);
  }, [params]);

  const [previouslySelectedMonth, setPreviouslySelectedMonth] = useState<
    DayDate | undefined
  >();

  const goToMonth = useCallback(
    (_month: DayDate) => {
      const month = _month.firstOfMonth();
      setPreviouslySelectedMonth(selectedMonth);
      params.set("month", month.toString());
      setParams(params);
      setFocusedDay(month.toString());
    },
    [params, selectedMonth, setParams]
  );

  const calendarStartDay = useMemo(() => {
    return selectedMonth.firstOfMonth().fullMonthBackFill();
  }, [selectedMonth]);

  const calendarEndDay = useMemo(() => {
    return selectedMonth.nextMonth(1).previousDay().fullMonthForwardFill();
  }, [selectedMonth]);

  const { data: shiftPositionsResult, refetch: refetchTeamShiftsQuery } =
    useTeamShiftsQuery({
      team: getDefined(team),
      startDay: calendarStartDay,
      endDay: calendarEndDay,
      pollingIntervalMs: 30000,
      pause: createDialogOpen || autoFillDialogOpen,
    });

  const { draggingShiftPosition, onCellDragOver, onCellDragLeave, onCellDrop } =
    useTeamShiftsDragAndDrop(shiftPositionsResult);

  const { shiftPositionsMap } = useTeamShiftPositionsMap({
    draggingShiftPosition,
    shiftPositionsResult,
  });

  // ------- focus navigation -------

  const [focusedDay, setFocusedDay] = useState<string | null>(null);
  const { focusedShiftPosition, setFocusedShiftPosition } =
    useTeamShiftsFocusNavigation({
      shiftPositionsMap,
      selectedMonth,
      previouslySelectedMonth: previouslySelectedMonth ?? null,
      goToMonth,
    });
  // ------- clipboard -------

  const {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition,
  } = useTeamShiftsClipboard(focusedShiftPosition, focusedDay);

  const { createShiftPosition, updateShiftPosition, deleteShiftPosition } =
    useTeamShiftActions();

  // editing shift position
  const [editingShiftPosition, setEditingShiftPosition] = useState<
    ShiftPositionType | undefined
  >(undefined);

  const handleEditShiftPosition = (shiftPosition: ShiftPositionWithFake) => {
    setEditingShiftPosition(shiftPosition.original ?? shiftPosition);
    setCreateDialogOpen(true);
  };

  // team leave schedule

  const [showLeaveSchedule, setShowLeaveSchedule] = useLocalPreference(
    "team-shifts-calendar-show-leave-schedule",
    false
  );

  const { leaveSchedule } = useTeamLeaveSchedule({
    company: getDefined(company),
    team: getDefined(team),
    calendarStartDay,
    calendarEndDay,
    pause: !showLeaveSchedule,
  });

  // for each week (monday to sunday) we need to calculate the maximum number of positions in each day

  const maxShiftPositionRowsPerWeekNumber = useMemo(() => {
    const weekNumbers: Array<number> = [];
    for (const [day, shiftPositions] of Object.entries(
      shiftPositionsMap
    ).sort()) {
      const week = new DayDate(day).getWeekNumber();
      const dayShiftPositionsRows = shiftPositions.reduce(
        (acc, shiftPosition) => acc + shiftPosition.rowSpan,
        0
      );
      weekNumbers[week] = Math.max(
        weekNumbers[week] ?? 0,
        dayShiftPositionsRows
      );
    }

    return weekNumbers;
  }, [shiftPositionsMap]);

  const maxLeaveRowsPerWeekNumber = useMemo(() => {
    const weekNumbers: Array<number> = [];
    for (const [day, leaves] of Object.entries(leaveSchedule)) {
      const week = new DayDate(day).getWeekNumber();
      weekNumbers[week] = Math.max(weekNumbers[week] ?? 0, leaves.length);
    }
    return weekNumbers;
  }, [leaveSchedule]);

  // join the two arrays
  const maxRowsPerWeekNumber = useMemo(() => {
    return maxShiftPositionRowsPerWeekNumber.map(
      (maxShiftPositionRows, week) => {
        return (
          maxShiftPositionRows * 2 + (maxLeaveRowsPerWeekNumber[week] ?? 0)
        );
      }
    );
  }, [maxShiftPositionRowsPerWeekNumber, maxLeaveRowsPerWeekNumber]);

  return (
    <>
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title={
          editingShiftPosition
            ? "Edit position"
            : "Insert position into the team schedule."
        }
      >
        <Suspense>
          <CreateOrEditScheduleShiftPosition
            editingShiftPosition={editingShiftPosition}
            day={focusedDay ? new DayDate(focusedDay) : selectedMonth}
            onCancel={useCallback(() => setCreateDialogOpen(false), [])}
            onCreate={useCallback(
              async (params) => {
                if (await createShiftPosition(params)) {
                  setCreateDialogOpen(false);
                  refetchTeamShiftsQuery();
                }
              },
              [createShiftPosition, refetchTeamShiftsQuery]
            )}
            onUpdate={useCallback(
              async (params) => {
                if (await updateShiftPosition(params)) {
                  setCreateDialogOpen(false);
                  refetchTeamShiftsQuery();
                }
              },
              [refetchTeamShiftsQuery, updateShiftPosition]
            )}
          />
        </Suspense>
      </Dialog>
      <Dialog
        open={autoFillDialogOpen}
        onClose={() => setAutoFillDialogOpen(false)}
        title={"Auto fill"}
        className="w-screen min-h-screen"
      >
        <Suspense>
          <ShiftsAutoFill
            team={getDefined(team)}
            startRange={useMemo(
              () =>
                new DayDateInterval(
                  selectedMonth.firstOfMonth(),
                  selectedMonth.nextMonth(1).previousDay()
                ),
              [selectedMonth]
            )}
            onAssignShiftPositions={() => {
              setAutoFillDialogOpen(false);
            }}
          />
        </Suspense>
      </Dialog>
      <MonthCalendar
        onDayFocus={setFocusedDay}
        year={selectedMonth.getYear()}
        month={selectedMonth.getMonth() - 1}
        additionalActions={useMemo(
          () => [
            {
              type: "button",
              text: "Add position",
              onClick: () => {
                setEditingShiftPosition(undefined);
                setCreateDialogOpen(true);
              },
            },
            {
              type: "button",
              text: "Auto fill",
              onClick: () => {
                setAutoFillDialogOpen(true);
              },
            },
            {
              type: "component",
              component: (
                <LabeledSwitch
                  label="Show leave schedule"
                  checked={showLeaveSchedule}
                  onChange={setShowLeaveSchedule}
                />
              ),
            },
          ],
          [setShowLeaveSchedule, showLeaveSchedule]
        )}
        goTo={(year, month) => {
          const day = new DayDate(year, month + 1, 1);
          goToMonth(day);
        }}
        renderDay={(day, dayIndex) => {
          const shiftPositions = shiftPositionsMap?.[day.date];
          const leaves = leaveSchedule[day.date];
          if (!shiftPositions && !leaves) {
            return null;
          }
          const weekNumber = new DayDate(day.date).getWeekNumber();
          const rowCount: number | undefined = maxRowsPerWeekNumber[weekNumber];
          const leaveRowCount = maxLeaveRowsPerWeekNumber[weekNumber] ?? 0;
          return (
            <div
              className={classNames("h-full w-full grid")}
              style={{
                gridTemplateRows: `repeat(${rowCount ?? (shiftPositions?.length ?? 0) + (leaves?.length ?? 0)}, 1fr)`,
              }}
            >
              {leaves?.map((leave, leaveIndex) => (
                <div
                  key={leave.user.pk}
                  className={classNames(
                    "p-2 border-gray-200",
                    leaveIndex > 0 && "border-t",
                    shiftPositions?.length > 0 && "border-b"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <div className="text-sm flex items-center">
                      <div
                        className="text-sm rounded-full p-1 bg-white"
                        style={{
                          backgroundColor: leave.color,
                        }}
                        title={leave.type}
                      >
                        {leave.icon}
                      </div>
                    </div>
                    <div className="flex items-center -ml-2">
                      <Avatar size={25} {...leave.user} />
                    </div>
                    <div className="text-tiny truncate text-gray-400">
                      {leave.user.name}
                    </div>
                  </div>
                </div>
              ))}
              {Array.from({
                length: leaveRowCount - (leaves?.length ?? 0),
              }).map((_, leaveIndex) => (
                <div key={`leave-${leaveIndex}`} className="h-full w-full" />
              ))}
              {shiftPositions?.map((shiftPosition, shiftPositionIndex) => (
                <div key={shiftPosition.sk} className="row-span-2">
                  <ShiftPosition
                    lastRow={shiftPositionIndex === shiftPositions.length - 1}
                    focus={
                      (focusedShiftPosition &&
                        focusedShiftPosition == shiftPosition) ||
                      false
                    }
                    setFocusedShiftPosition={setFocusedShiftPosition}
                    shiftPosition={shiftPosition}
                    tabIndex={dayIndex * 100 + shiftPositionIndex}
                    handleEditShiftPosition={handleEditShiftPosition}
                    copyShiftPositionToClipboard={copyShiftPositionToClipboard}
                    hasCopiedShiftPosition={hasCopiedShiftPosition}
                    pasteShiftPositionFromClipboard={
                      pasteShiftPositionFromClipboard
                    }
                    deleteShiftPosition={deleteShiftPosition}
                  />
                </div>
              ))}
            </div>
          );
        }}
        onCellDrop={onCellDrop}
        onCellDragOver={onCellDragOver}
        onCellDragLeave={onCellDragLeave}
      />
    </>
  );
};
