import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";

import type {
  ShiftPosition as ShiftPositionType,
  User,
} from "../../graphql/graphql";
import { useAnalyzeTeamShiftsCalendar } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { useAnalyzeTeamShiftsCalendarParams as useAnalyzeTeamShiftsCalendarParameters } from "../../hooks/useAnalyzeTeamShiftsCalendarParams";
import { useEntityNavigationContext } from "../../hooks/useEntityNavigationContext";
import { useHolidays } from "../../hooks/useHolidays";
import { useLocalPreference } from "../../hooks/useLocalPreference";
import { useMutation } from "../../hooks/useMutation";
import { useSearchParam as useSearchParameter } from "../../hooks/useSearchParam";
import {
  LeaveRenderInfo,
  useTeamLeaveSchedule,
} from "../../hooks/useTeamLeaveSchedule";
import { useTeamShiftActions } from "../../hooks/useTeamShiftActions";
import {
  type ShiftPositionWithFake,
  type ShiftPositionWithRowSpan,
  useTeamShiftPositionsMap,
} from "../../hooks/useTeamShiftPositionsMap";
import { useTeamShiftsClipboard } from "../../hooks/useTeamShiftsClipboard";
import { useTeamShiftsDragAndDrop } from "../../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsFocusNavigation } from "../../hooks/useTeamShiftsFocusNavigation";
import { useTeamShiftsQuery } from "../../hooks/useTeamShiftsQuery";
import { classNames } from "../../utils/classNames";
import { shiftPositionKey } from "../../utils/shiftPositionKey";
import { toMinutes } from "../../utils/toMinutes";
import { MemberLeaveInCalendar } from "../atoms/MemberLeaveInCalendar";
import { PublishActions } from "../atoms/PublishActions";
import { ShiftPosition } from "../atoms/ShiftPosition";
import { Day } from "../particles/MonthDailyCalendar";
import { AnalyzeTeamShiftsCalendarMenu } from "../team-shifts/AnalyzeTeamShiftsCalendarMenu";
import {
  TeamShiftsCalendar,
  TeamShiftsCalendarProps as TeamShiftsCalendarProperties,
} from "../team-shifts/TeamShiftsCalendar";

import { CreateOrEditScheduleDayTemplateDialog } from "./CreateOrEditScheduleDayTemplateDialog";
import { CreateOrEditScheduleShiftPositionDialog } from "./CreateOrEditScheduleShiftPositionDialog";
import { CreateShiftPositionTemplateDialog } from "./CreateShiftPositionTemplateDialog";
import { FilterTeamShiftsCalendarMenu } from "./FilterTeamShiftsCalendarMenu";
import { PublishShiftPositionsDialog } from "./PublishShiftPositionsDialog";
import { RevertShiftPositionsDialog } from "./RevertShiftPositionsDialog";
import { ShiftsAutofillDialog } from "./ShiftsAutofillDialog";
import { TeamDayTemplates } from "./TeamDayTemplates";
import { TeamHolidaysMenu } from "./TeamHolidaysMenu";
import { TeamShiftPositionTemplates } from "./TeamShiftPositionTemplates";
import { TeamShiftsActionsMenu } from "./TeamShiftsActionsMenu";
import { TeamShiftsScheduleOptionsMenu } from "./TeamShiftsScheduleOptionsMenu";
import { UnassignShiftPositionsDialog } from "./UnassignShiftPositionsDialog";

import { DayDate } from "@/day-date";
import assignShiftPositionsMutation from "@/graphql-client/mutations/assignShiftPositions.graphql";
import unassignShiftPositionMutation from "@/graphql-client/mutations/unassignShiftPosition.graphql";
import { getDefined } from "@/utils";

export const TeamShiftsSchedule = () => {
  const { companyPk, teamPk, team } = useEntityNavigationContext();
  const { current: isDialogOpen, set: setIsDialogOpen } = useSearchParameter(
    "team-shift-schedule-dialog"
  );
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);

  const [parameters, setParameters] = useSearchParams();
  const selectedMonth = useMemo(() => {
    const month = parameters.get("month");
    if (!month) {
      return DayDate.today();
    }
    return new DayDate(month);
  }, [parameters]);

  const [previouslySelectedMonth, setPreviouslySelectedMonth] =
    useState<DayDate>(selectedMonth);

  const goToMonth = useCallback(
    (_month: DayDate) => {
      const month = _month.firstOfMonth();
      if (!selectedMonth.isSameMonth(month)) {
        setPreviouslySelectedMonth(selectedMonth);
        parameters.set("month", month.toString());
        setParameters(parameters);
      }
    },
    [parameters, selectedMonth, setParameters]
  );

  const calendarStartDay = useMemo(() => {
    return selectedMonth.firstOfMonth().fullMonthBackFill();
  }, [selectedMonth]);

  const calendarEndDay = useMemo(() => {
    return selectedMonth.nextMonth(1).previousDay().fullMonthForwardFill();
  }, [selectedMonth]);

  // ------- filters -------

  const [showFilters, setShowFilters] = useLocalPreference(
    "team-shifts-calendar-show-filters",
    false
  );

  const [filterUsers, setFilterUsers] = useLocalPreference(
    "team-shifts-calendar-filter-users",
    false
  );

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // ------- holidays -------

  const [showHolidays, setShowHolidays] = useLocalPreference(
    "team-shifts-calendar-show-holidays",
    false
  );

  const [holidaysCountry, setHolidaysCountry] = useLocalPreference<
    string | undefined
  >("team-shifts-calendar-holidays-country");

  const [holidaysRegion, setHolidaysRegion] = useLocalPreference<
    string | undefined
  >("team-shifts-calendar-holidays-region");

  const { data: holidays } = useHolidays({
    country: holidaysCountry,
    region: holidaysRegion,
    startDate: calendarStartDay,
    endDate: calendarEndDay,
  });

  // ------- shift positions -------

  const {
    data: shiftPositionsResult,
    refetch: refetchTeamShiftsQuery,
    error,
    fetching,
  } = useTeamShiftsQuery({
    team: getDefined(teamPk),
    startDay: calendarStartDay,
    endDay: calendarEndDay,
    pollingIntervalMs: 30_000,
    pause: !!isDialogOpen,
    restrictToUsers: showFilters && filterUsers ? filteredUsers : undefined,
  });

  const {
    draggingShiftPosition,
    onCellDragOver,
    onCellDragLeave,
    onCellDrop,
    onShiftPositionDragStart,
    onShiftPositionDragEnd,
  } = useTeamShiftsDragAndDrop(
    getDefined(teamPk),
    shiftPositionsResult?.shiftPositions ?? []
  );

  // ------- assign shift positions -------
  // asssign shift positions

  const [, assignShiftPositions] = useMutation(assignShiftPositionsMutation);
  const [, unassignShiftPosition] = useMutation(unassignShiftPositionMutation);

  const handleAssignShiftPosition = useCallback(
    async (shiftPosition: ShiftPositionType, member?: User | null) => {
      console.log("handleAssignShiftPosition", shiftPosition, member);
      if (!member) {
        const result = await unassignShiftPosition({
          input: {
            team: getDefined(teamPk),
            shiftPositionSk: shiftPosition.sk,
          },
        });
        if (!result.error) {
          toast.success(i18n.t("Shift position unassigned successfully"));
        }
        return;
      }
      const result = await assignShiftPositions({
        input: {
          team: getDefined(teamPk),
          assignments: [
            { shiftPositionId: shiftPosition.sk, workerPk: member.pk },
          ],
        },
      });
      if (!result.error) {
        toast.success(i18n.t("Shift positions assigned successfully"));
      }
    },
    [assignShiftPositions, teamPk, unassignShiftPosition]
  );

  // ------- schedule details -------

  const [showScheduleDetails, setShowScheduleDetails] = useLocalPreference(
    "team-shifts-calendar-show-schedule-details",
    false
  );

  let { shiftPositionsMap } = useTeamShiftPositionsMap({
    draggingShiftPosition: draggingShiftPosition as ShiftPositionType | null,
    shiftPositionsResult: shiftPositionsResult?.shiftPositions ?? [],
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

  // ------- shift position selection -------

  const [selectedShiftPositionKeys, setSelectedShiftPositionKeys] = useState<
    string[]
  >([]);

  const onShiftPositionClick = useCallback(
    (shiftPosition: ShiftPositionWithFake, event_: MouseEvent) => {
      if (event_.shiftKey) {
        if (
          selectedShiftPositionKeys.includes(shiftPositionKey(shiftPosition))
        ) {
          setSelectedShiftPositionKeys((selectedShiftPositionKeys) =>
            selectedShiftPositionKeys.filter(
              (pos) => pos !== shiftPositionKey(shiftPosition)
            )
          );
        } else {
          setSelectedShiftPositionKeys((selectedShiftPositionKeys) =>
            [...selectedShiftPositionKeys, shiftPositionKey(shiftPosition)]
          );
        }
      } else {
        setSelectedShiftPositionKeys([shiftPositionKey(shiftPosition)]);
      }
    },
    [selectedShiftPositionKeys]
  );

  useEffect(() => {
    // remove the selected shift positions that are not visible in the current calendar
    setSelectedShiftPositionKeys((selectedShiftPositionKeys) => {
      if (selectedShiftPositionKeys.length === 0) {
        return selectedShiftPositionKeys;
      }
      const startDay = calendarStartDay.toString();
      const endDay = calendarEndDay.toString();
      const newSelectedShiftPositionKeys = selectedShiftPositionKeys.filter(
        (key) => {
          const shiftPositions = shiftPositionsMap[key];
          return (
            shiftPositions &&
            shiftPositions.some(
              (shiftPosition) =>
                shiftPosition.day >= startDay && shiftPosition.day <= endDay
            )
          );
        }
      );
      if (
        newSelectedShiftPositionKeys.length !== selectedShiftPositionKeys.length
      ) {
        return newSelectedShiftPositionKeys;
      }
      return selectedShiftPositionKeys;
    });
  }, [calendarStartDay, calendarEndDay, shiftPositionsMap]);

  // ------- clipboard -------

  const {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition,
  } = useTeamShiftsClipboard(selectedShiftPositionKeys, focusedDay);

  const { deleteShiftPosition } = useTeamShiftActions();

  // editing shift position
  const [editingShiftPosition, setEditingShiftPosition] = useState<
    ShiftPositionType | undefined
  >();

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
    restrictToUsers: showFilters && filterUsers ? filteredUsers : undefined,
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
    analyzeWorkerInconvenienceEquality,
    setAnalyzeWorkerInconvenienceEquality,
    analyzeWorkerSlotEquality,
    setAnalyzeWorkerSlotEquality,
    analyzeWorkerSlotProximity,
    setAnalyzeWorkerSlotProximity,
  } = useAnalyzeTeamShiftsCalendarParameters(analyze);

  const { analyzedShiftPositionsMap } = useAnalyzeTeamShiftsCalendar(
    useMemo(
      () => ({
        teamPk: getDefined(teamPk),
        startDate: calendarStartDay,
        endDate: calendarEndDay,
        analyzeLeaveConflicts,
        shiftPositionsMap,
        leaveSchedule,
        requireMaximumIntervalBetweenShifts,
        maximumIntervalBetweenShiftsInDays: maximumIntervalBetweenShiftsInDays,
        requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
        minimumNumberOfShiftsPerWeekInStandardWorkday,
        requireMinimumRestSlotsAfterShift,
        minimumRestSlotsAfterShift,
        analyzeWorkerInconvenienceEquality,
        analyzeWorkerSlotEquality,
        analyzeWorkerSlotProximity,
      }),
      [
        teamPk,
        calendarStartDay,
        calendarEndDay,
        analyzeLeaveConflicts,
        shiftPositionsMap,
        leaveSchedule,
        requireMaximumIntervalBetweenShifts,
        maximumIntervalBetweenShiftsInDays,
        requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
        minimumNumberOfShiftsPerWeekInStandardWorkday,
        requireMinimumRestSlotsAfterShift,
        minimumRestSlotsAfterShift,
        analyzeWorkerInconvenienceEquality,
        analyzeWorkerSlotEquality,
        analyzeWorkerSlotProximity,
      ]
    )
  );

  shiftPositionsMap = analyzedShiftPositionsMap;

  // ------- position templates -------

  const [showTemplates, setShowTemplates] = useLocalPreference(
    "team-shifts-calendar-show-templates",
    false
  );

  // ------- day templates -------

  const [showDayTemplates, setShowDayTemplates] = useLocalPreference(
    "team-shifts-calendar-show-day-templates",
    false
  );

  // ------- publish -------

  const onPublishChanges = useCallback(async () => {
    setIsDialogOpen("publish");
  }, [setIsDialogOpen]);

  const onRevertToPublished = useCallback(() => {
    setIsDialogOpen("revert");
  }, [setIsDialogOpen]);

  // ------- render -------

  // for each week (monday to sunday) we need to calculate the maximum number of positions in each day

  const maxShiftPositionRowsPerWeekNumber = useMemo(() => {
    const weekNumbers: Array<number> = [];
    for (const [day, shiftPositions] of Object.entries(
      shiftPositionsMap
    ).sort()) {
      const week = new DayDate(day).getWeekNumber();
      const dayShiftPositionsRows = shiftPositions.reduce(
        (accumulator, shiftPosition) => accumulator + shiftPosition.rowSpan,
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
    if (!showLeaveSchedule) {
      return [];
    }
    const weekNumbers: Array<number> = [];
    for (const [day, leaves] of Object.entries(leaveSchedule)) {
      const week = new DayDate(day).getWeekNumber();
      weekNumbers[week] = Math.max(weekNumbers[week] ?? 0, leaves.length);
    }
    return weekNumbers;
  }, [leaveSchedule, showLeaveSchedule]);

  const maxHolidayRowsPerWeekNumber = useMemo(() => {
    if (!showHolidays) {
      return [];
    }
    const weekNumbers: Array<number> = [];
    for (const [day] of Object.entries(holidays ?? {})) {
      const week = new DayDate(day).getWeekNumber();
      weekNumbers[week] = Math.max(weekNumbers[week] ?? 0, 1);
    }
    return weekNumbers;
  }, [holidays, showHolidays]);

  console.log("maxHolidayRowsPerWeekNumber", maxHolidayRowsPerWeekNumber);

  // join the two arrays
  const maxRowsPerWeekNumber = useMemo(() => {
    return maxShiftPositionRowsPerWeekNumber.map(
      (maxShiftPositionRows, week) => {
        return (
          maxShiftPositionRows +
          (showLeaveSchedule ? maxLeaveRowsPerWeekNumber[week] ?? 0 : 0) +
          (showHolidays ? maxHolidayRowsPerWeekNumber[week] ?? 0 : 0)
        );
      }
    );
  }, [
    maxShiftPositionRowsPerWeekNumber,
    showLeaveSchedule,
    maxLeaveRowsPerWeekNumber,
    showHolidays,
    maxHolidayRowsPerWeekNumber,
  ]);

  // render per day

  const renderDay = useCallback(
    (day: Day, dayIndex: number) => {
      const shiftPositions = shiftPositionsMap?.[day.date];
      const leaves = showLeaveSchedule ? leaveSchedule[day.date] : undefined;
      const holidaysForDay = showHolidays ? holidays?.[day.date] : undefined;
      if (!shiftPositions && !leaves && !holidaysForDay) {
        return null;
      }
      const weekNumber = new DayDate(day.date).getWeekNumber();
      const rowCount: number | undefined = maxRowsPerWeekNumber[weekNumber];
      const leaveRowCount = showLeaveSchedule
        ? maxLeaveRowsPerWeekNumber[weekNumber] ?? 0
        : 0;

      const weekHasHolidays = showHolidays
        ? maxHolidayRowsPerWeekNumber[weekNumber] ?? 0
        : 0;

      return (
        <div
          key={`day-${day.date}`}
          className="h-full w-full grid"
          style={{
            gridTemplateRows: `repeat(${
              rowCount ?? (shiftPositions?.length ?? 0) + (leaves?.length ?? 0)
            }, 1fr)`,
          }}
        >
          {holidaysForDay ? (
            <div className="p-2 border-gray-100 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0">
              <div className="bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs font-semibold inline-block leading-tight">
                {holidaysForDay}
              </div>
            </div>
          ) : (weekHasHolidays ? (
            <div className="p-2 border-gray-100 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0"></div>
          ) : null)}
          {leaves?.map((leave, leaveIndex) => (
            <Transition show={showLeaveSchedule} appear key={leaveIndex}>
              <div
                className={classNames(
                  "p-2 border-gray-100 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0",
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
            <div key={`leave-row-${leaveIndex}`} className="h-full w-full" />
          ))}
          {shiftPositions?.map((shiftPosition, shiftPositionIndex) => {
            const hasConflict =
              shiftPosition.assignedTo != undefined &&
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
                className="transition-all duration-300 ease-in"
                onClick={(event_) => {
                  onShiftPositionClick(shiftPosition, event_);
                  event_.preventDefault();
                  event_.stopPropagation();
                }}
              >
                <ShiftPosition
                  teamPk={getDefined(teamPk)}
                  lastRow={shiftPositionIndex === shiftPositions.length - 1}
                  focus={
                    (focusedShiftPosition &&
                      focusedShiftPosition == shiftPosition) ||
                    false
                  }
                  setFocusedShiftPosition={(shiftPosition) => {
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
                  isSelected={selectedShiftPositionKeys.includes(
                    shiftPositionKey(shiftPosition)
                  )}
                  showScheduleDetails={showScheduleDetails}
                  handleAssignShiftPosition={handleAssignShiftPosition}
                  onShiftPositionDragStart={onShiftPositionDragStart}
                  onShiftPositionDragEnd={onShiftPositionDragEnd}
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
      handleAssignShiftPosition,
      handleEditShiftPosition,
      hasCopiedShiftPosition,
      holidays,
      leaveSchedule,
      maxHolidayRowsPerWeekNumber,
      maxLeaveRowsPerWeekNumber,
      maxRowsPerWeekNumber,
      onShiftPositionClick,
      onShiftPositionDragEnd,
      onShiftPositionDragStart,
      pasteShiftPositionFromClipboard,
      selectedShiftPositionKeys,
      setFocusedShiftPosition,
      shiftPositionsMap,
      showHolidays,
      showLeaveSchedule,
      showScheduleDetails,
      teamPk,
    ]
  );

  // render per member and per day
  const members = useMemo(() => {
    return Object.values(shiftPositionsMap).reduce((accumulator, shiftPositions) => {
      for (const shiftPosition of shiftPositions) {
        const user = shiftPosition.assignedTo;
        if (user && !accumulator.find((m) => m.pk === user.pk)) {
          accumulator.push(user);
        }
      }
      return accumulator;
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
          .reduce((accumulator, shiftPosition) => {
            const day = shiftPosition.day;
            if (!accumulator[day]) {
              accumulator[day] = [];
            }
            accumulator[day].push(shiftPosition);
            return accumulator;
          }, {} as Record<string, ShiftPositionWithRowSpan[]>),
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
      const holidaysForDay = showHolidays ? holidays?.[dayString] : undefined;
      return (
        <div>
          {holidaysForDay ? (
            <div className="p-2 border-gray-100 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0">
              <div className="bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs font-semibold inline-block leading-tight">
                {holidaysForDay}
              </div>
            </div>
          ) : null}
          {leaves?.map((leave, leaveIndex) => (
            <Transition show={showLeaveSchedule} appear key={leaveIndex}>
              <div
                className={classNames(
                  "border-gray-100 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0",
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
              className="transition-all duration-300 ease-in"
              onClick={(event_) => {
                onShiftPositionClick(shiftPosition, event_);
                event_.preventDefault();
                event_.stopPropagation();
              }}
            >
              <ShiftPosition
                teamPk={getDefined(teamPk)}
                lastRow={shiftPositionIndex === shiftPositionsForDay.length - 1}
                focus={
                  (focusedShiftPosition &&
                    focusedShiftPosition == shiftPosition) ||
                  false
                }
                setFocusedShiftPosition={(shiftPosition) => {
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
                isSelected={selectedShiftPositionKeys.includes(
                  shiftPositionKey(shiftPosition)
                )}
                showScheduleDetails={showScheduleDetails}
                handleAssignShiftPosition={handleAssignShiftPosition}
                onShiftPositionDragStart={onShiftPositionDragStart}
                onShiftPositionDragEnd={onShiftPositionDragEnd}
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
      handleAssignShiftPosition,
      handleEditShiftPosition,
      hasCopiedShiftPosition,
      holidays,
      memberLeaveMap,
      memberShiftPositionsMap,
      onShiftPositionClick,
      onShiftPositionDragEnd,
      onShiftPositionDragStart,
      pasteShiftPositionFromClipboard,
      selectedShiftPositionKeys,
      setFocusedShiftPosition,
      showHolidays,
      showLeaveSchedule,
      showScheduleDetails,
      teamPk,
    ]
  );

  const additionalActions: TeamShiftsCalendarProperties["additionalActions"] =
    useMemo(
      () => [
        ...((team?.resourcePermission ?? -1) >= 2 // WRITE
          ? [
              {
                type: "component" as const,
                component: (
                  <TeamShiftsActionsMenu
                    onAddPosition={() => {
                      setEditingShiftPosition(undefined);
                      setIsDialogOpen("create");
                    }}
                    onAutoFill={() => {
                      setIsDialogOpen("autoFill");
                    }}
                    onUnassignPositions={() => {
                      setIsDialogOpen("unassign");
                    }}
                  />
                ),
              },
            ]
          : []),
        {
          type: "component" as const,
          component: (
            <TeamShiftsScheduleOptionsMenu
              showLeaveSchedule={showLeaveSchedule}
              setShowLeaveSchedule={setShowLeaveSchedule}
              showScheduleDetails={showScheduleDetails}
              setShowScheduleDetails={setShowScheduleDetails}
              analyze={analyze}
              setAnalyze={setAnalyze}
              showTemplates={showTemplates}
              setShowTemplates={setShowTemplates}
              showDayTemplates={showDayTemplates}
              setShowDayTemplates={setShowDayTemplates}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              showHolidays={showHolidays}
              setShowHolidays={setShowHolidays}
            />
          ),
        },
        {
          type: "component" as const,
          component: (
            <PublishActions
              areAnyUnpublished={
                shiftPositionsResult?.areAnyUnpublished ?? false
              }
              onPublishChanges={onPublishChanges}
              onRevertToPublished={onRevertToPublished}
            />
          ),
        },
      ],
      [
        analyze,
        onPublishChanges,
        onRevertToPublished,
        setAnalyze,
        setIsDialogOpen,
        setShowDayTemplates,
        setShowFilters,
        setShowHolidays,
        setShowLeaveSchedule,
        setShowScheduleDetails,
        setShowTemplates,
        shiftPositionsResult?.areAnyUnpublished,
        showDayTemplates,
        showFilters,
        showHolidays,
        showLeaveSchedule,
        showScheduleDetails,
        showTemplates,
        team?.resourcePermission,
      ]
    );

  const tools = useMemo(() => {
    return (
      <>
        {showTemplates && (
          <TeamShiftPositionTemplates
            teamPk={getDefined(teamPk)}
            onCreateTemplate={() => {
              setIsDialogOpen("create template");
            }}
          />
        )}
        {showDayTemplates && (
          <TeamDayTemplates
            teamPk={getDefined(teamPk)}
            onCreateTemplate={() => {
              setIsDialogOpen("create day template");
            }}
          />
        )}
      </>
    );
  }, [showTemplates, teamPk, showDayTemplates, setIsDialogOpen]);

  const showTools = useMemo(() => {
    return showTemplates || showDayTemplates;
  }, [showTemplates, showDayTemplates]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ExclamationTriangleIcon className="size-10 text-red-500" />
        <Trans>Error loading calendar data. Please refresh to try again.</Trans>
      </div>
    );
  }

  return (
    <div className="relative" role="region" aria-label="Team Shifts Schedule">
      {fetching ? (
        <div role="status" aria-live="polite">
          <Trans>Loading calendar...</Trans>
        </div>
      ) : (error ? (
        <div role="alert" aria-live="assertive">
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
      ))}
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
      <PublishShiftPositionsDialog
        isDialogOpen={isDialogOpen === "publish"}
        onClose={() => {
          setIsDialogOpen(null);
        }}
        onPublish={() => {
          setIsDialogOpen(null);
          refetchTeamShiftsQuery();
        }}
        teamPk={getDefined(teamPk)}
      />
      <RevertShiftPositionsDialog
        isDialogOpen={isDialogOpen === "revert"}
        onClose={() => {
          setIsDialogOpen(null);
        }}
        onRevert={() => {
          setIsDialogOpen(null);
          refetchTeamShiftsQuery();
        }}
        teamPk={getDefined(teamPk)}
      />
      <CreateShiftPositionTemplateDialog
        isDialogOpen={isDialogOpen === "create template"}
        onClose={() => {
          setIsDialogOpen(null);
        }}
        teamPk={getDefined(teamPk)}
      />
      <CreateOrEditScheduleDayTemplateDialog
        isDialogOpen={isDialogOpen === "create day template"}
        onClose={() => {
          setIsDialogOpen(null);
        }}
        teamPk={getDefined(teamPk)}
      />
      <TeamShiftsCalendar
        shiftPositionsMap={shiftPositionsMap}
        show={!isDialogOpen}
        onDayFocus={setFocusedDay}
        focusedDay={focusedDay}
        year={selectedMonth.getYear()}
        month={selectedMonth.getMonth() - 1}
        additionalActions={additionalActions}
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
        tools={
          <Transition show={showTools} appear>
            <div className="flex flex-col gap-10 divide-y divide-gray-200 transition-all duration-200 ease-in data-[closed]:opacity-0 data-[closed]:w-0 w-[200px]">
              {tools}
            </div>
          </Transition>
        }
      >
        <Transition show={analyze && !isDialogOpen} appear>
          <div
            className="mt-4 transition-opacity duration-300 ease-in data-[closed]:opacity-0"
            role="region"
            aria-label={i18n.t("Schedule Analysis Options")}
          >
            <Disclosure
              as="div"
              defaultOpen
              className="bg-gray-100 rounded-md p-2"
            >
              <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="text-sm/6 font-medium text-gray-500 group-data-hover:text-gray-500/80">
                  <Trans>Schedule Analysis Options</Trans>
                </span>
                <ChevronDownIcon className="size-4 text-gray-500 group-data-hover:text-gray-500/80 group-data-open:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="mt-2 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
              >
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
                  analyzeWorkerInconvenienceEquality={
                    analyzeWorkerInconvenienceEquality
                  }
                  setAnalyzeWorkerInconvenienceEquality={
                    setAnalyzeWorkerInconvenienceEquality
                  }
                  analyzeWorkerSlotEquality={analyzeWorkerSlotEquality}
                  setAnalyzeWorkerSlotEquality={setAnalyzeWorkerSlotEquality}
                  analyzeWorkerSlotProximity={analyzeWorkerSlotProximity}
                  setAnalyzeWorkerSlotProximity={setAnalyzeWorkerSlotProximity}
                />
              </DisclosurePanel>
            </Disclosure>
          </div>
        </Transition>

        <Transition show={showFilters && !isDialogOpen} appear>
          <div
            className="mt-4 transition-opacity duration-300 ease-in data-[closed]:opacity-0"
            role="region"
            aria-label="Schedule Analysis Options"
          >
            <Disclosure
              as="div"
              defaultOpen
              className="bg-gray-100 rounded-md p-2"
            >
              <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="text-sm/6 font-medium text-gray-500 group-data-hover:text-gray-500/80">
                  <Trans>Schedule Analysis Options</Trans>
                </span>
                <ChevronDownIcon className="size-4 text-gray-500 group-data-hover:text-gray-500/80 group-data-open:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="mt-2 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
              >
                <FilterTeamShiftsCalendarMenu
                  filterUsers={filterUsers}
                  setFilterUsers={setFilterUsers}
                  allUsers={team?.members ?? []}
                  filteredUsers={filteredUsers}
                  setFilteredUsers={setFilteredUsers}
                />
              </DisclosurePanel>
            </Disclosure>
          </div>
        </Transition>

        <Transition show={showHolidays && !isDialogOpen} appear>
          <div
            className="mt-4 transition-opacity duration-300 ease-in data-[closed]:opacity-0"
            role="region"
            aria-label={i18n.t("Holidays Options")}
          >
            <Disclosure
              as="div"
              defaultOpen
              className="bg-gray-100 rounded-md p-2"
            >
              <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="text-sm/6 font-medium text-gray-500 group-data-hover:text-gray-500/80">
                  <Trans>Holidays Options</Trans>
                </span>
                <ChevronDownIcon className="size-4 text-gray-500 group-data-hover:text-gray-500/80 group-data-open:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="mt-2 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
              >
                <TeamHolidaysMenu
                  selectedCountryIsoCode={holidaysCountry}
                  selectedRegionIsoCode={holidaysRegion}
                  onChangeCountry={setHolidaysCountry}
                  onChangeRegion={setHolidaysRegion}
                />
              </DisclosurePanel>
            </Disclosure>
          </div>
        </Transition>
      </TeamShiftsCalendar>
    </div>
  );
};
