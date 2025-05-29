import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { DayDate } from "@/day-date";
import { Trans } from "@lingui/react/macro";
import { Transition } from "@headlessui/react";
import { getDefined } from "@/utils";
import { useTeamShiftsDragAndDrop } from "../../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsClipboard } from "../../hooks/useTeamShiftsClipboard";
import { useTeamShiftActions } from "../../hooks/useTeamShiftActions";
import { useTeamShiftsQuery } from "../../hooks/useTeamShiftsQuery";
import { useTeamShiftsFocusNavigation } from "../../hooks/useTeamShiftsFocusNavigation";
import {
  type ShiftPositionWithFake,
  type ShiftPositionWithRowSpan,
  useTeamShiftPositionsMap,
} from "../../hooks/useTeamShiftPositionsMap";
import type {
  ShiftPosition as ShiftPositionType,
  User,
} from "../../graphql/graphql";
import {
  LeaveRenderInfo,
  useTeamLeaveSchedule,
} from "../../hooks/useTeamLeaveSchedule";
import { useLocalPreference } from "../../hooks/useLocalPreference";
import { useEntityNavigationContext } from "../../hooks/useEntityNavigationContext";
import { useSearchParam } from "../../hooks/useSearchParam";
import {
  AnalyzedShiftPosition,
  useAnalyzeTeamShiftsCalendar,
} from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { toMinutes } from "../../utils/toMinutes";
import { classNames } from "../../utils/classNames";
import { ShiftPosition } from "../atoms/ShiftPosition";
import { LabeledSwitch } from "../particles/LabeledSwitch";
import { TeamShiftsCalendar } from "../team-shifts/TeamShiftsCalendar";
import { MemberLeaveInCalendar } from "../atoms/MemberLeaveInCalendar";
import { Day } from "../particles/MonthDailyCalendar";
import { UnassignShiftPositionsDialog } from "./UnassignShiftPositionsDialog";
import { CreateOrEditScheduleShiftPositionDialog } from "./CreateOrEditScheduleShiftPositionDialog";
import { ShiftsAutofillDialog } from "./ShiftsAutofillDialog";
import { useAnalyzeTeamShiftsCalendarParams } from "../../hooks/useAnalyzeTeamShiftsCalendarParams";
import { AnalyzeTeamShiftsCalendarMenu } from "../team-shifts/AnalyzeTeamShiftsCalendarMenu";

export const TeamShiftsSchedule = () => {
  const { companyPk, teamPk, team } = useEntityNavigationContext();
  const { current: isDialogOpen, set: setIsDialogOpen } = useSearchParam(
    "team-shift-schedule-dialog"
  );
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);

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
    team: getDefined(teamPk),
    startDay: calendarStartDay,
    endDay: calendarEndDay,
    pollingIntervalMs: 30000,
    pause: !!isDialogOpen,
  });

  const { draggingShiftPosition, onCellDragOver, onCellDragLeave, onCellDrop } =
    useTeamShiftsDragAndDrop(shiftPositionsResult);

  // ------- schedule details -------

  const [showScheduleDetails, setShowScheduleDetails] = useLocalPreference(
    "team-shifts-calendar-show-schedule-details",
    false
  );

  let shiftPositionsMap: Record<string, AnalyzedShiftPosition[]> =
    useTeamShiftPositionsMap({
      draggingShiftPosition,
      shiftPositionsResult,
      spillTime: showScheduleDetails,
    }).shiftPositionsMap;

  // ------- focus navigation -------

  const [focusedDay, setFocusedDay] = useState<string | undefined>();

  const { focusedShiftPosition, setFocusedShiftPosition } =
    useTeamShiftsFocusNavigation({
      shiftPositionsMap,
      selectedMonth,
      previouslySelectedMonth: previouslySelectedMonth ?? null,
      goToMonth,
    });

  // ------- shift position selection -------

  const [selectedShiftPositions, setSelectedShiftPositions] = useState<
    ShiftPositionWithFake[]
  >([]);
  const onShiftPositionClick = useCallback(
    (shiftPosition: ShiftPositionWithFake, ev: MouseEvent) => {
      if (ev.shiftKey) {
        if (selectedShiftPositions.includes(shiftPosition)) {
          setSelectedShiftPositions((shiftPositions) =>
            shiftPositions.filter((pos) => pos !== shiftPosition)
          );
        } else {
          setSelectedShiftPositions((shiftPositions) =>
            shiftPositions.concat([shiftPosition])
          );
        }
      } else {
        setSelectedShiftPositions([shiftPosition]);
      }
    },
    [selectedShiftPositions]
  );

  // ------- clipboard -------

  const {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition,
  } = useTeamShiftsClipboard(selectedShiftPositions, focusedDay);

  const { deleteShiftPosition } = useTeamShiftActions();

  // editing shift position
  const [editingShiftPosition, setEditingShiftPosition] = useState<
    ShiftPositionType | undefined
  >(undefined);

  const handleEditShiftPosition = useCallback(
    (shiftPosition: ShiftPositionWithFake) => {
      setEditingShiftPosition(shiftPosition.original ?? shiftPosition);
      setIsDialogOpen("create");
    },
    [setEditingShiftPosition, setIsDialogOpen]
  );

  // ------- team leave schedule -------

  const [showLeaveSchedule, setShowLeaveSchedule] = useLocalPreference(
    "team-shifts-calendar-show-leave-schedule",
    false
  );

  const { leaveSchedule } = useTeamLeaveSchedule({
    company: getDefined(companyPk),
    team: getDefined(teamPk),
    calendarStartDay,
    calendarEndDay,
  });

  // ------- analyze -------

  const [analyze, setAnalyze] = useLocalPreference(
    "team-shifts-calendar-analyze",
    false
  );

  const {
    analyzeLeaveConflicts,
    setAnalyzeLeaveConflicts,
    requireMaximumIntervalBetweenShifts,
    setRequireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShiftsInDays,
    setMaximumIntervalBetweenShiftsInDays,
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    minimumNumberOfShiftsPerWeekInStandardWorkday,
    setMinimumNumberOfShiftsPerWeekInStandardWorkday,
    requireMinimumRestSlotsAfterShift,
    setRequireMinimumRestSlotsAfterShift,
    minimumRestSlotsAfterShift,
    setMinimumRestSlotsAfterShift,
  } = useAnalyzeTeamShiftsCalendarParams(analyze);

  const { analyzedShiftPositionsMap } = useAnalyzeTeamShiftsCalendar({
    analyzeLeaveConflicts,
    shiftPositionsMap,
    leaveSchedule,
    requireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShiftsInDays: maximumIntervalBetweenShiftsInDays,
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    minimumNumberOfShiftsPerWeekInStandardWorkday,
    requireMinimumRestSlotsAfterShift,
    minimumRestSlotsAfterShift,
  });

  shiftPositionsMap = analyzedShiftPositionsMap;

  // ------- render -------

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

  // render per day

  const renderDay = useCallback(
    (day: Day, dayIndex: number) => {
      const shiftPositions = shiftPositionsMap?.[day.date];
      const leaves = showLeaveSchedule ? leaveSchedule[day.date] : undefined;
      if (!shiftPositions && !leaves) {
        return null;
      }
      const weekNumber = new DayDate(day.date).getWeekNumber();
      const rowCount: number | undefined = maxRowsPerWeekNumber[weekNumber];
      const leaveRowCount = maxLeaveRowsPerWeekNumber[weekNumber] ?? 0;

      return (
        <div
          key={`day-${day.date}`}
          className="h-full w-full grid"
          style={{
            gridTemplateRows: `repeat(${rowCount ?? (shiftPositions?.length ?? 0) + (leaves?.length ?? 0)}, 1fr)`,
          }}
        >
          {leaves?.map((leave, leaveIndex) => (
            <Transition show={showLeaveSchedule} appear key={leaveIndex}>
              <div
                className={classNames(
                  "p-2 border-gray-100 row-span-2 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0",
                  leaveIndex === 0 && "border-t",
                  leaveIndex === leaveRowCount - 1 && "border-b"
                )}
              >
                <MemberLeaveInCalendar
                  member={leave.user}
                  leave={leave}
                  leaveIndex={leaveIndex}
                />
              </div>
            </Transition>
          ))}
          {Array.from({
            length: leaveRowCount - (leaves?.length ?? 0),
          }).map((_, leaveIndex) => (
            <div
              key={`leave-row-${leaveIndex}`}
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
              <div
                key={`shift-position-${shiftPositionIndex}`}
                className="row-span-3 transition-all duration-300 ease-in"
                onClick={(ev) => {
                  onShiftPositionClick(shiftPosition, ev);
                  ev.preventDefault();
                  ev.stopPropagation();
                }}
              >
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
                  copyShiftPositionToClipboard={copyShiftPositionToClipboard}
                  hasCopiedShiftPosition={hasCopiedShiftPosition || undefined}
                  pasteShiftPositionFromClipboard={
                    pasteShiftPositionFromClipboard
                  }
                  deleteShiftPosition={deleteShiftPosition}
                  conflicts={hasConflict}
                  isSelected={selectedShiftPositions.includes(shiftPosition)}
                  showScheduleDetails={showScheduleDetails}
                />
              </div>
            );
          })}
        </div>
      );
    },
    [
      copyShiftPositionToClipboard,
      deleteShiftPosition,
      focusedShiftPosition,
      handleEditShiftPosition,
      hasCopiedShiftPosition,
      leaveSchedule,
      maxLeaveRowsPerWeekNumber,
      maxRowsPerWeekNumber,
      onShiftPositionClick,
      pasteShiftPositionFromClipboard,
      selectedShiftPositions,
      setFocusedShiftPosition,
      shiftPositionsMap,
      showLeaveSchedule,
      showScheduleDetails,
    ]
  );

  // render per member and per day
  const members = useMemo(() => {
    return Object.values(shiftPositionsMap).reduce((acc, shiftPositions) => {
      for (const shiftPosition of shiftPositions) {
        const user = shiftPosition.assignedTo;
        if (user && !acc.find((m) => m.pk === user.pk)) {
          acc.push(user);
        }
      }
      return acc;
    }, [] as User[]);
  }, [shiftPositionsMap]);

  const memberShiftPositionsMap: Record<
    string,
    Record<string, ShiftPositionWithRowSpan[]>
  > = useMemo(() => {
    return Object.fromEntries(
      members.map((member) => [
        member.pk,
        Object.values(shiftPositionsMap)
          .flatMap((shiftPositions) =>
            shiftPositions.filter(
              (shiftPosition) => shiftPosition.assignedTo?.pk === member.pk
            )
          )
          .reduce(
            (acc, shiftPosition) => {
              const day = shiftPosition.day;
              if (!acc[day]) {
                acc[day] = [];
              }
              acc[day].push(shiftPosition);
              return acc;
            },
            {} as Record<string, ShiftPositionWithRowSpan[]>
          ),
      ])
    );
  }, [members, shiftPositionsMap]);

  const memberLeaveMap: Record<
    string,
    Record<string, LeaveRenderInfo[]>
  > = useMemo(() => {
    return Object.fromEntries(
      members.map((member) => [
        member.pk,
        Object.fromEntries(
          Object.entries(leaveSchedule).map(([day, leaves]) => [
            day,
            leaves.filter((leave) => leave.user.pk === member.pk),
          ])
        ),
      ])
    );
  }, [leaveSchedule, members]);

  const renderMemberDay = useCallback(
    (member: User, day: DayDate) => {
      const dayString = day.toString();
      const leaves = showLeaveSchedule
        ? memberLeaveMap[member.pk]?.[dayString]
        : undefined;
      const shiftPositionsForDay =
        memberShiftPositionsMap[member.pk]?.[dayString];
      return (
        <div>
          {leaves?.map((leave, leaveIndex) => (
            <Transition show={showLeaveSchedule} appear key={leaveIndex}>
              <div
                className={classNames(
                  "p-2 border-gray-100 row-span-2 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0",
                  leaveIndex === 0 && "border-t",
                  leaveIndex === leaves.length - 1 && "border-b"
                )}
              >
                <MemberLeaveInCalendar
                  member={leave.user}
                  leave={leave}
                  leaveIndex={leaveIndex}
                  showName={false}
                  showAvatar={false}
                />
              </div>
            </Transition>
          ))}
          {shiftPositionsForDay?.map((shiftPosition, shiftPositionIndex) => (
            <div
              key={`shift-position-${shiftPositionIndex}`}
              className="row-span-3 transition-all duration-300 ease-in"
              onClick={(ev) => {
                onShiftPositionClick(shiftPosition, ev);
                ev.preventDefault();
                ev.stopPropagation();
              }}
            >
              <ShiftPosition
                lastRow={shiftPositionIndex === shiftPositionsForDay.length - 1}
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
                handleEditShiftPosition={handleEditShiftPosition}
                copyShiftPositionToClipboard={copyShiftPositionToClipboard}
                hasCopiedShiftPosition={hasCopiedShiftPosition || undefined}
                pasteShiftPositionFromClipboard={
                  pasteShiftPositionFromClipboard
                }
                deleteShiftPosition={deleteShiftPosition}
                conflicts={false}
                isSelected={selectedShiftPositions.includes(shiftPosition)}
                showScheduleDetails={showScheduleDetails}
              />
            </div>
          ))}
        </div>
      );
    },
    [
      copyShiftPositionToClipboard,
      deleteShiftPosition,
      focusedShiftPosition,
      handleEditShiftPosition,
      hasCopiedShiftPosition,
      memberLeaveMap,
      memberShiftPositionsMap,
      onShiftPositionClick,
      pasteShiftPositionFromClipboard,
      selectedShiftPositions,
      setFocusedShiftPosition,
      showLeaveSchedule,
      showScheduleDetails,
    ]
  );

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
        <CreateOrEditScheduleShiftPositionDialog
          isDialogOpen={isDialogOpen === "create"}
          setIsDialogOpen={(isDialogOpen) =>
            setIsDialogOpen(isDialogOpen ? "create" : null)
          }
          isHelpPanelOpen={helpPanelOpen}
          editingShiftPosition={editingShiftPosition}
          focusedDay={focusedDay ? new DayDate(focusedDay) : undefined}
          selectedMonth={selectedMonth}
          setIsHelpPanelOpen={setHelpPanelOpen}
          helpPanelOpen={helpPanelOpen}
          setHelpPanelOpen={setHelpPanelOpen}
        />
      )}
      <ShiftsAutofillDialog
        isDialogOpen={isDialogOpen === "autoFill"}
        onClose={() => {
          refetchTeamShiftsQuery();
          setIsDialogOpen(null);
        }}
        helpPanelOpen={helpPanelOpen}
        setHelpPanelOpen={setHelpPanelOpen}
        teamPk={getDefined(teamPk)}
        selectedMonth={selectedMonth}
      />
      <UnassignShiftPositionsDialog
        isDialogOpen={isDialogOpen === "unassign"}
        onClose={() => {
          refetchTeamShiftsQuery();
          setIsDialogOpen(null);
        }}
        isHelpPanelOpen={helpPanelOpen}
        setHelpPanelOpen={setHelpPanelOpen}
        teamPk={getDefined(teamPk)}
      />
      <TeamShiftsCalendar
        shiftPositionsMap={shiftPositionsMap}
        show={!isDialogOpen}
        onDayFocus={setFocusedDay}
        focusedDay={focusedDay}
        year={selectedMonth.getYear()}
        month={selectedMonth.getMonth() - 1}
        additionalActions={useMemo(
          () => [
            ...((team?.resourcePermission ?? -1) >= 2 // WRITE
              ? [
                  {
                    type: "button",
                    text: <Trans>Add position</Trans>,
                    onClick: () => {
                      setEditingShiftPosition(undefined);
                      setIsDialogOpen("create");
                    },
                  } as const,
                  {
                    type: "button",
                    text: <Trans>Auto fill</Trans>,
                    onClick: () => {
                      setIsDialogOpen("autoFill");
                    },
                  } as const,
                  {
                    type: "button",
                    text: <Trans>Unassign positions</Trans>,
                    onClick: () => {
                      setIsDialogOpen("unassign");
                    },
                  } as const,
                ]
              : []),
            {
              type: "component",
              component: (
                <LabeledSwitch
                  label={<Trans>Leaves</Trans>}
                  checked={showLeaveSchedule}
                  onChange={setShowLeaveSchedule}
                />
              ),
            },
            {
              type: "component",
              component: (
                <LabeledSwitch
                  label={<Trans>Details</Trans>}
                  checked={showScheduleDetails}
                  onChange={setShowScheduleDetails}
                />
              ),
            },
            {
              type: "component",
              component: (
                <LabeledSwitch
                  label={<Trans>Analyze</Trans>}
                  checked={analyze}
                  onChange={setAnalyze}
                />
              ),
            },
          ],
          [
            analyze,
            setAnalyze,
            setIsDialogOpen,
            setShowLeaveSchedule,
            setShowScheduleDetails,
            showLeaveSchedule,
            showScheduleDetails,
            team?.resourcePermission,
          ]
        )}
        goTo={(year, month) => {
          const day = new DayDate(year, month + 1, 1);
          goToMonth(day);
        }}
        renderDay={renderDay}
        members={members}
        renderMemberDay={renderMemberDay}
        onCellDrop={onCellDrop}
        onCellDragOver={onCellDragOver}
        onCellDragLeave={onCellDragLeave}
        onAdd={() => {
          setEditingShiftPosition(undefined);
          setIsDialogOpen("create");
        }}
      >
        <Transition show={analyze} appear>
          <div className="mt-4 transition-all duration-300 ease-in data-[closed]:opacity-0">
            <AnalyzeTeamShiftsCalendarMenu
              analyzeLeaveConflicts={analyzeLeaveConflicts}
              setAnalyzeLeaveConflicts={setAnalyzeLeaveConflicts}
              requireMaximumIntervalBetweenShifts={
                requireMaximumIntervalBetweenShifts
              }
              setRequireMaximumIntervalBetweenShifts={
                setRequireMaximumIntervalBetweenShifts
              }
              maximumIntervalBetweenShiftsInDays={
                maximumIntervalBetweenShiftsInDays
              }
              setMaximumIntervalBetweenShiftsInDays={
                setMaximumIntervalBetweenShiftsInDays
              }
              requireMinimumNumberOfShiftsPerWeekInStandardWorkday={
                requireMinimumNumberOfShiftsPerWeekInStandardWorkday
              }
              setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday={
                setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday
              }
              minimumNumberOfShiftsPerWeekInStandardWorkday={
                minimumNumberOfShiftsPerWeekInStandardWorkday
              }
              setMinimumNumberOfShiftsPerWeekInStandardWorkday={
                setMinimumNumberOfShiftsPerWeekInStandardWorkday
              }
              requireMinimumRestSlotsAfterShift={
                requireMinimumRestSlotsAfterShift
              }
              setRequireMinimumRestSlotsAfterShift={
                setRequireMinimumRestSlotsAfterShift
              }
              minimumRestSlotsAfterShift={minimumRestSlotsAfterShift}
              setMinimumRestSlotsAfterShift={setMinimumRestSlotsAfterShift}
            />
          </div>
        </Transition>
      </TeamShiftsCalendar>
    </div>
  );
};
