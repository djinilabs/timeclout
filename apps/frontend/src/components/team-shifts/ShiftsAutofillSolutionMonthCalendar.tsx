import { FC, memo, useCallback, useMemo, useState } from "react";
import { DayDate } from "@/day-date";
import { Transition } from "@headlessui/react";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { SchedulerState } from "@/scheduler";
import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { LeaveRenderInfo } from "../../hooks/useTeamLeaveSchedule";
import { useAnalyzeTeamShiftsCalendar } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { useAnalyzeTeamShiftsCalendarParams } from "../../hooks/useAnalyzeTeamShiftsCalendarParams";
import { classNames } from "../../utils/classNames";
import { Day, MonthDailyCalendar } from "../particles/MonthDailyCalendar";
import { ShiftPosition } from "../atoms/ShiftPosition";
import { Avatar } from "../particles/Avatar";
import { Tabs } from "../molecules/Tabs";
import { LabeledSwitch } from "../particles/LabeledSwitch";
import {
  MonthlyCalendarPerMember,
  User,
} from "../atoms/MonthlyCalendarPerMember";
import { TeamShiftsSummary } from "./TeamShiftsSummary";
import { CalendarHeader } from "../atoms/CalendarHeader";
import { MemberLeaveInCalendar } from "../atoms/MemberLeaveInCalendar";
import { AnalyzeTeamShiftsCalendarMenu } from "./AnalyzeTeamShiftsCalendarMenu";

export interface ShiftsAutofillSolutionMonthCalendarProps {
  teamPk: string;
  startDate: DayDate;
  endDate: DayDate;
  year: number;
  month: number;
  progress: SchedulerState;
  showScheduleDetails: boolean;
  setShowScheduleDetails: (showScheduleDetails: boolean) => void;
  showLeaveSchedule: boolean;
  setShowLeaveSchedule: (showLeaveSchedule: boolean) => void;
  assignedShiftPositions: Record<string, ShiftPositionWithRowSpan[]>;
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
  analyze: boolean;
  setAnalyze: (analyze: boolean) => void;
}

export const ShiftsAutofillSolutionMonthCalendar: FC<ShiftsAutofillSolutionMonthCalendarProps> =
  memo((props) => {
    const {
      teamPk,
      startDate,
      endDate,
      year,
      month,
      showScheduleDetails,
      setShowScheduleDetails,
      showLeaveSchedule,
      setShowLeaveSchedule,
      analyze,
      setAnalyze,
      leaveSchedule,
      progress,
    } = props;

    let assignedShiftPositions = props.assignedShiftPositions;

    // analyze
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
    } = useAnalyzeTeamShiftsCalendarParams(analyze);

    assignedShiftPositions = useAnalyzeTeamShiftsCalendar({
      shiftPositionsMap: assignedShiftPositions,
      analyzeLeaveConflicts,
      requireMaximumIntervalBetweenShifts,
      maximumIntervalBetweenShiftsInDays,
      requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
      teamPk,
      startDate,
      endDate,
      leaveSchedule,
      minimumNumberOfShiftsPerWeekInStandardWorkday,
      requireMinimumRestSlotsAfterShift,
      minimumRestSlotsAfterShift,
      analyzeWorkerInconvenienceEquality,
      analyzeWorkerSlotEquality,
      analyzeWorkerSlotProximity,
    }).analyzedShiftPositionsMap;

    // for each week (monday to sunday) we need to calculate the maximum number of positions in each day
    const maxRowsPerWeekNumber = useMemo(() => {
      const weekNumbers: Array<number> = [];
      for (const [day, shiftPositions] of Object.entries(
        assignedShiftPositions
      ).sort()) {
        const dayShiftPositionsRows = shiftPositions.reduce(
          (acc, shiftPosition) => acc + shiftPosition.rowSpan,
          0
        );
        const dayLeaveRows = leaveSchedule?.[day]?.length ?? 0;
        const week = new DayDate(day).getWeekNumber();
        weekNumbers[week] = Math.max(
          weekNumbers[week] ?? 0,
          dayShiftPositionsRows + dayLeaveRows
        );
      }
      return weekNumbers;
    }, [leaveSchedule, assignedShiftPositions]);

    const renderDay = useCallback(
      (day: Day) => {
        const shiftPositions = assignedShiftPositions?.[day.date];
        if (!shiftPositions) {
          return null;
        }
        const leaves = showLeaveSchedule
          ? leaveSchedule?.[day.date]
          : undefined;
        const rowCount: number | undefined =
          maxRowsPerWeekNumber[new DayDate(day.date).getWeekNumber()];
        return (
          <div
            className={classNames("h-full w-full grid")}
            style={{
              gridTemplateRows: `repeat(${
                rowCount ?? shiftPositions.length
              }, 1fr)`,
            }}
          >
            {leaves?.map((leave, leaveIndex) => (
              <div
                key={leave.user.pk}
                className={classNames(
                  "p-2 border-gray-100 bg-gray-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#f3f4f6_10px,#f3f4f6_20px)]",
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
            {shiftPositions.map((shiftPosition) => (
              <ShiftPosition
                key={shiftPosition.sk}
                shiftPosition={shiftPosition}
                conflicts={progress.problemInSlotIds.has(shiftPosition.sk)}
                showScheduleDetails={showScheduleDetails}
              />
            ))}
          </div>
        );
      },
      [
        assignedShiftPositions,
        leaveSchedule,
        maxRowsPerWeekNumber,
        progress.problemInSlotIds,
        showLeaveSchedule,
        showScheduleDetails,
      ]
    );

    const tabs = useMemo(
      () => [
        {
          name: i18n.t("By day"),
          href: "by-day",
        },
        {
          name: i18n.t("By member"),
          href: "by-member",
        },
        {
          name: i18n.t("By duration"),
          href: "by-duration",
        },
      ],
      []
    );

    // collect all members from assignedShiftPositions
    const members = useMemo(() => {
      const members: User[] = [];
      for (const shiftPositions of Object.values(assignedShiftPositions)) {
        for (const shiftPosition of shiftPositions) {
          if (
            shiftPosition.assignedTo &&
            !members.find(
              (member) => member.pk === shiftPosition.assignedTo?.pk
            )
          ) {
            members.push(shiftPosition.assignedTo);
          }
        }
      }
      return members;
    }, [assignedShiftPositions]);

    const memberShiftPositionsMap: Record<
      string,
      Record<string, ShiftPositionWithRowSpan[]>
    > = useMemo(() => {
      return Object.fromEntries(
        members.map((member) => [
          member.pk,
          Object.values(assignedShiftPositions)
            .flatMap((shiftPositions) =>
              shiftPositions.filter(
                (shiftPosition) => shiftPosition.assignedTo?.pk === member.pk
              )
            )
            .reduce((acc, shiftPosition) => {
              const day = shiftPosition.day;
              if (!acc[day]) {
                acc[day] = [];
              }
              acc[day].push(shiftPosition);
              return acc;
            }, {} as Record<string, ShiftPositionWithRowSpan[]>),
        ])
      );
    }, [members, assignedShiftPositions]);

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
        const shiftPositionsForDay =
          memberShiftPositionsMap[member.pk]?.[day.toString()];
        const leaves = showLeaveSchedule
          ? memberLeaveMap[member.pk]?.[day.toString()]
          : undefined;
        if (!leaves && !shiftPositionsForDay) {
          return null;
        }

        return (
          <>
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
              >
                <ShiftPosition
                  lastRow={
                    shiftPositionIndex === shiftPositionsForDay.length - 1
                  }
                  shiftPosition={shiftPosition}
                  conflicts={false}
                  showScheduleDetails={showScheduleDetails}
                />
              </div>
            ))}
          </>
        );
      },
      [
        memberLeaveMap,
        memberShiftPositionsMap,
        showLeaveSchedule,
        showScheduleDetails,
      ]
    );

    const [tab, setTab] = useState(tabs[0]);

    const additionalActions = useMemo(
      () => [
        {
          type: "component",
          component: (
            <LabeledSwitch
              label={<Trans>Show schedule details</Trans>}
              checked={showScheduleDetails}
              onChange={setShowScheduleDetails}
            />
          ),
        } as const,
        {
          type: "component",
          component: (
            <LabeledSwitch
              label={<Trans>Show leave schedule</Trans>}
              checked={showLeaveSchedule}
              onChange={setShowLeaveSchedule}
            />
          ),
        } as const,
        {
          type: "component",
          component: (
            <LabeledSwitch
              label={<Trans>Analyze</Trans>}
              checked={analyze}
              onChange={setAnalyze}
            />
          ),
        } as const,
      ],
      [
        analyze,
        setAnalyze,
        setShowLeaveSchedule,
        setShowScheduleDetails,
        showLeaveSchedule,
        showScheduleDetails,
      ]
    );

    return (
      <div role="region" aria-label={i18n.t("Team shifts calendar")}>
        <CalendarHeader
          {...props}
          monthIsZeroBased={false}
          additionalActions={additionalActions}
        />

        <Transition show={analyze} appear>
          <div
            className="mt-4 transition-opacity duration-300 ease-in data-[closed]:opacity-0"
            role="region"
            aria-label={i18n.t("Analysis settings")}
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
          </div>
        </Transition>

        <Tabs
          tabs={tabs}
          tabPropName="shiftsCalendarTab"
          onChange={setTab}
          aria-label={i18n.t("Calendar view options")}
        >
          <div className="mt-4">
            {tab.href === "by-day" ? (
              <MonthDailyCalendar
                year={year}
                month={month - 1}
                renderDay={renderDay}
                aria-label={i18n.t("Calendar view by day")}
              />
            ) : tab.href === "by-member" ? (
              <MonthlyCalendarPerMember
                year={year}
                month={month - 1}
                members={members}
                renderMemberDay={renderMemberDay}
                aria-label={i18n.t("Calendar view by member")}
              />
            ) : (
              <TeamShiftsSummary
                year={year}
                month={month - 1}
                shiftPositionsMap={assignedShiftPositions}
                aria-label={i18n.t("Team shifts summary")}
              />
            )}
          </div>
        </Tabs>
      </div>
    );
  });
