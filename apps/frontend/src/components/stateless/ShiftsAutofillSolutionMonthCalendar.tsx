import { DayDate } from "@/day-date";
import { Day, MonthDailyCalendar } from "./MonthDailyCalendar";
import { classNames } from "../../utils/classNames";
import { ShiftPosition } from "./ShiftPosition";
import { Avatar } from "./Avatar";
import { FC, memo, useCallback, useMemo, useState } from "react";
import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { LeaveRenderInfo } from "../../hooks/useTeamLeaveSchedule";
import { SchedulerState } from "@/scheduler";
import { Tabs } from "./Tabs";
import { i18n } from "@lingui/core";
import { MonthlyCalendarPerMember, User } from "./MonthlyCalendarPerMember";
import { TeamShiftsSummary } from "./TeamShiftsSummary";
import { CalendarHeader } from "./CalendarHeader";
import { LabeledSwitch } from "./LabeledSwitch";
import { Trans } from "@lingui/react/macro";

export interface ShiftsAutofillSolutionMonthCalendarProps {
  year: number;
  month: number;
  progress: SchedulerState;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
  showScheduleDetails: boolean;
  setShowScheduleDetails: (showScheduleDetails: boolean) => void;
  showLeaveSchedule: boolean;
  setShowLeaveSchedule: (showLeaveSchedule: boolean) => void;
  assignedShiftPositions: Record<string, ShiftPositionWithRowSpan[]>;
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
}

export const ShiftsAutofillSolutionMonthCalendar: FC<ShiftsAutofillSolutionMonthCalendarProps> =
  memo((props) => {
    const {
      year,
      month,
      shiftPositionsMap,
      showScheduleDetails,
      setShowScheduleDetails,
      showLeaveSchedule,
      setShowLeaveSchedule,
      assignedShiftPositions,
      leaveSchedule,
      progress,
    } = props;
    // for each week (monday to sunday) we need to calculate the maximum number of positions in each day

    const maxRowsPerWeekNumber = useMemo(() => {
      const weekNumbers: Array<number> = [];
      for (const [day, shiftPositions] of Object.entries(
        shiftPositionsMap
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
    }, [leaveSchedule, shiftPositionsMap]);

    const renderDay = useCallback(
      (day: Day) => {
        const shiftPositions = assignedShiftPositions?.[day.date];
        if (!shiftPositions) {
          return null;
        }
        const leaves = leaveSchedule?.[day.date];
        const rowCount: number | undefined =
          maxRowsPerWeekNumber[new DayDate(day.date).getWeekNumber()];
        return (
          <div
            className={classNames("h-full w-full grid")}
            style={{
              gridTemplateRows: `repeat(${rowCount ?? shiftPositions.length}, 1fr)`,
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
    }, [members, assignedShiftPositions]);

    const renderMemberDay = useCallback(
      (member: User, day: DayDate) => {
        const shiftPositions = memberShiftPositionsMap[member.pk];
        if (!shiftPositions) {
          return null;
        }
        const shiftPositionsForDay = shiftPositions[day.toString()];
        if (!shiftPositionsForDay) {
          return null;
        }
        return shiftPositionsForDay.map((shiftPosition, shiftPositionIndex) => (
          <div
            key={`shift-position-${shiftPositionIndex}`}
            className="row-span-3 transition-all duration-300 ease-in"
          >
            <ShiftPosition
              lastRow={shiftPositionIndex === shiftPositionsForDay.length - 1}
              shiftPosition={shiftPosition}
              conflicts={false}
              showScheduleDetails={showScheduleDetails}
            />
          </div>
        ));
      },
      [memberShiftPositionsMap, showScheduleDetails]
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
      ],
      [
        setShowLeaveSchedule,
        setShowScheduleDetails,
        showLeaveSchedule,
        showScheduleDetails,
      ]
    );

    return (
      <div>
        <CalendarHeader {...props} additionalActions={additionalActions} />
        <Tabs tabs={tabs} tabPropName="shiftsCalendarTab" onChange={setTab} />
        {tab.href === "by-day" ? (
          <MonthDailyCalendar
            year={year}
            month={month - 1}
            renderDay={renderDay}
          />
        ) : tab.href === "by-member" ? (
          <MonthlyCalendarPerMember
            year={year}
            month={month - 1}
            members={members}
            renderMemberDay={renderMemberDay}
          />
        ) : (
          <TeamShiftsSummary
            year={year}
            month={month - 1}
            shiftPositionsMap={assignedShiftPositions}
          />
        )}
      </div>
    );
  });
