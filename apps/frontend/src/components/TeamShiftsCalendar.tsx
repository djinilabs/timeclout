import { useCallback, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { DayDate, DayDateInterval } from "@/day-date";
import { Trans } from "@lingui/react/macro";
import teamQuery from "@/graphql-client/queries/teamQuery.graphql";
import { getDefined } from "@/utils";
import { Dialog } from "./stateless/Dialog";
import { MonthCalendar } from "./stateless/MonthCalendar";
import { CreateOrEditScheduleShiftPosition } from "./CreateOrEditScheduleShiftPosition";
import { Suspense } from "./stateless/Suspense";
import { ShiftPosition } from "./stateless/ShiftPosition";
import { useTeamShiftsDragAndDrop } from "../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsClipboard } from "../hooks/useTeamShiftsClipboard";
import { useTeamShiftActions } from "../hooks/useTeamShiftActions";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { useTeamShiftsFocusNavigation } from "../hooks/useTeamShiftsFocusNavigation";
import {
  type ShiftPositionWithFake,
  useTeamShiftPositionsMap,
} from "../hooks/useTeamShiftPositionsMap";
import { classNames } from "../utils/classNames";
import {
  Query,
  QueryTeamArgs,
  ShiftPosition as ShiftPositionType,
} from "../graphql/graphql";
import { ShiftsAutoFill } from "./ShiftsAutoFill";
import { useTeamLeaveSchedule } from "../hooks/useTeamLeaveSchedule";
import { Avatar } from "./stateless/Avatar";
import { useLocalPreference } from "../hooks/useLocalPreference";
import { LabeledSwitch } from "./stateless/LabeledSwitch";
import { toMinutes } from "../utils/toMinutes";
import { useQuery } from "../hooks/useQuery";

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

  const [previouslySelectedMonth, setPreviouslySelectedMonth] =
    useState<DayDate>(selectedMonth);

  const goToMonth = useCallback(
    (_month: DayDate) => {
      const month = _month.firstOfMonth();
      if (!selectedMonth.isSameMonth(month)) {
        setPreviouslySelectedMonth(selectedMonth);
        params.set("month", month.toString());
        setParams(params);
      }
    },
    [params, selectedMonth, setParams]
  );

  const calendarStartDay = useMemo(() => {
    return selectedMonth.firstOfMonth().fullMonthBackFill();
  }, [selectedMonth]);

  const calendarEndDay = useMemo(() => {
    return selectedMonth.nextMonth(1).previousDay().fullMonthForwardFill();
  }, [selectedMonth]);

  const {
    data: shiftPositionsResult,
    refetch: refetchTeamShiftsQuery,
    error,
    fetching,
  } = useTeamShiftsQuery({
    team: getDefined(team),
    startDay: calendarStartDay,
    endDay: calendarEndDay,
    pollingIntervalMs: 30000,
    pause: createDialogOpen || autoFillDialogOpen,
  });

  const { draggingShiftPosition, onCellDragOver, onCellDragLeave, onCellDrop } =
    useTeamShiftsDragAndDrop(shiftPositionsResult);

  // ------- schedule details -------

  const [showScheduleDetails, setShowScheduleDetails] = useLocalPreference(
    "team-shifts-calendar-show-schedule-details",
    false
  );

  const { shiftPositionsMap } = useTeamShiftPositionsMap({
    draggingShiftPosition,
    shiftPositionsResult,
    spillTime: showScheduleDetails,
  });

  // ------- focus navigation -------

  const [focusedDay, setFocusedDay] = useState<string | undefined>();

  const { focusedShiftPosition, setFocusedShiftPosition } =
    useTeamShiftsFocusNavigation({
      shiftPositionsMap,
      selectedMonth,
      previouslySelectedMonth: previouslySelectedMonth ?? null,
      goToMonth,
    });

  console.log("focusedShiftPosition", focusedShiftPosition);

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

  // team

  const [queryResponse] = useQuery<{ team: Query["team"] }, QueryTeamArgs>({
    query: teamQuery,
    variables: {
      teamPk: getDefined(team, "No team provided"),
    },
  });
  const teamResult = queryResponse.data?.team;

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
          maxShiftPositionRows * 3 + (maxLeaveRowsPerWeekNumber[week] ?? 0) * 2
        );
      }
    );
  }, [maxShiftPositionRowsPerWeekNumber, maxLeaveRowsPerWeekNumber]);

  return (
    <div>
      {fetching ? (
        <div>
          <Trans>Loading calendar...</Trans>
        </div>
      ) : error ? (
        <div>
          <Trans>Error loading calendar data</Trans>
        </div>
      ) : (
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          title={
            editingShiftPosition ? (
              <Trans>Edit position</Trans>
            ) : (
              <Trans>Insert position into the team schedule</Trans>
            )
          }
        >
          <Suspense>
            <CreateOrEditScheduleShiftPosition
              editingShiftPosition={editingShiftPosition}
              day={focusedDay ? new DayDate(focusedDay) : selectedMonth}
              onCancel={() => setCreateDialogOpen(false)}
              onCreate={async (params) => {
                if (await createShiftPosition(params)) {
                  setCreateDialogOpen(false);
                  refetchTeamShiftsQuery();
                }
              }}
              onUpdate={async (params) => {
                if (await updateShiftPosition(params)) {
                  setCreateDialogOpen(false);
                  refetchTeamShiftsQuery();
                }
              }}
            />
          </Suspense>
        </Dialog>
      )}
      <Dialog
        open={autoFillDialogOpen}
        onClose={() => setAutoFillDialogOpen(false)}
        title={<Trans>Auto fill</Trans>}
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
        focusedDay={focusedDay}
        year={selectedMonth.getYear()}
        month={selectedMonth.getMonth() - 1}
        additionalActions={useMemo(
          () => [
            ...((teamResult?.resourcePermission ?? -1) >= 2 // WRITE
              ? [
                  {
                    type: "button",
                    text: <Trans>Add position</Trans>,
                    onClick: () => {
                      setEditingShiftPosition(undefined);
                      setCreateDialogOpen(true);
                    },
                  } as const,
                  {
                    type: "button",
                    text: <Trans>Auto fill</Trans>,
                    onClick: () => {
                      setAutoFillDialogOpen(true);
                    },
                  } as const,
                ]
              : []),
            {
              type: "component",
              component: (
                <LabeledSwitch
                  label={<Trans>Show leave schedule</Trans>}
                  checked={showLeaveSchedule}
                  onChange={setShowLeaveSchedule}
                />
              ),
            },
            {
              type: "component",
              component: (
                <LabeledSwitch
                  label={<Trans>Show schedule details</Trans>}
                  checked={showScheduleDetails}
                  onChange={setShowScheduleDetails}
                />
              ),
            },
          ],
          [
            setShowLeaveSchedule,
            setShowScheduleDetails,
            showLeaveSchedule,
            showScheduleDetails,
            teamResult?.resourcePermission,
          ]
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
              className="h-full w-full grid"
              style={{
                gridTemplateRows: `repeat(${rowCount ?? (shiftPositions?.length ?? 0) + (leaves?.length ?? 0)}, 1fr)`,
              }}
            >
              {leaves?.map((leave, leaveIndex) => (
                <div
                  key={leave.user.pk}
                  className={classNames(
                    "p-2 border-gray-100 row-span-2 bg-gray-50",
                    leaveIndex === 0 && "border-t",
                    leaveIndex === leaves.length - 1 && "border-b"
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
                <div
                  key={`leave-${leaveIndex}`}
                  className="h-full w-full row-span-2"
                />
              ))}
              {shiftPositions?.map((shiftPosition, shiftPositionIndex) => {
                const hasConflict =
                  shiftPosition.assignedTo != null &&
                  (leaves?.some(
                    (leave) => leave.user.pk === shiftPosition.assignedTo?.pk
                  ) ||
                    shiftPosition.schedules.some((schedule) => {
                      const startMinutes = toMinutes(
                        schedule.startHourMinutes as [number, number]
                      );
                      const endMinutes = toMinutes(
                        schedule.endHourMinutes as [number, number]
                      );
                      return shiftPositions.some((otherShiftPosition) => {
                        if (
                          otherShiftPosition.sk === shiftPosition.sk ||
                          otherShiftPosition.assignedTo?.pk !==
                            shiftPosition.assignedTo?.pk
                        ) {
                          return false;
                        }
                        return otherShiftPosition.schedules.some(
                          (otherSchedule) => {
                            const otherStartMinutes = toMinutes(
                              otherSchedule.startHourMinutes as [number, number]
                            );
                            const otherEndMinutes = toMinutes(
                              otherSchedule.endHourMinutes as [number, number]
                            );
                            return (
                              startMinutes < otherEndMinutes &&
                              endMinutes > otherStartMinutes
                            );
                          }
                        );
                      });
                    }));

                return (
                  <div key={shiftPosition.sk} className="row-span-3">
                    <ShiftPosition
                      lastRow={shiftPositionIndex === shiftPositions.length - 1}
                      focus={
                        (focusedShiftPosition &&
                          focusedShiftPosition == shiftPosition) ||
                        false
                      }
                      setFocusedShiftPosition={(shiftPosition) => {
                        console.log("new focused shiftPosition", shiftPosition);
                        setFocusedShiftPosition(shiftPosition);
                      }}
                      shiftPosition={shiftPosition}
                      tabIndex={dayIndex * 100 + shiftPositionIndex}
                      handleEditShiftPosition={handleEditShiftPosition}
                      copyShiftPositionToClipboard={
                        copyShiftPositionToClipboard
                      }
                      hasCopiedShiftPosition={hasCopiedShiftPosition}
                      pasteShiftPositionFromClipboard={
                        pasteShiftPositionFromClipboard
                      }
                      deleteShiftPosition={deleteShiftPosition}
                      conflicts={hasConflict}
                      showScheduleDetails={showScheduleDetails}
                    />
                  </div>
                );
              })}
            </div>
          );
        }}
        onCellDrop={onCellDrop}
        onCellDragOver={onCellDragOver}
        onCellDragLeave={onCellDragLeave}
      />
    </div>
  );
};
