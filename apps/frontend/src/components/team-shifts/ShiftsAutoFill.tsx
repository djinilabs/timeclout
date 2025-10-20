import { Transition } from "@headlessui/react";
import { Trans } from "@lingui/react/macro";
import { dequal } from "dequal";
import { useState, useEffect, FC, useRef, useCallback } from "react";

import { ShiftsAutoFillParams } from "../../graphql/graphql";
import { useLocale } from "../../hooks/useLocale";
import { useLocalPreference } from "../../hooks/useLocalPreference";
import { useQuery } from "../../hooks/useQuery";
import { useTeamShiftsQuery } from "../../hooks/useTeamShiftsQuery";
import { Suspense } from "../atoms/Suspense";
import { Button } from "../particles/Button";
import { Loading } from "../particles/Loading";
import {
  ShiftAutoFillParams,
  type ShiftAutoFillParamValues,
} from "../team-shifts/ShiftAutoFillParams";
import { ShiftsAutoFillProgress } from "../team-shifts/ShiftsAutoFillProgress";

import { DayDate, DayDateInterval } from "@/day-date";
import shiftsAutoFillParamsQuery from "@/graphql-client/queries/shiftsAutoFillParams.graphql";
import { SchedulerState, RuleName } from "@/scheduler";
import { SchedulerWorkerClient } from "@/scheduler-worker";

export interface ShiftsAutoFillWithoutParamsProps {
  isAutoFillRunning: boolean;
  team: string;
  startDate?: DayDate;
  endDate?: DayDate;
  workerInconvenienceEquality: number;
  workerSlotEquality: number;
  workerSlotProximity: number;
  avoidNonWorkDayFirstShift: number;
  respectLeaveSchedule: boolean;
  requireMaximumIntervalBetweenShifts: boolean;
  maximumIntervalBetweenShifts: number;
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean;
  minimumNumberOfShiftsPerWeekInStandardWorkday: number;
  requireFirstShiftAfterExtendedLeave: boolean;
  firstShiftAfterExtendedLeaveMinimumDays: number;
  firstShiftAfterExtendedLeaveApplicableTypes: string[];
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
  onAssignShiftPositions: () => void;
  progress: SchedulerState | undefined;
  onProgress: (progress: SchedulerState | undefined) => void;
}

export const ShiftsAutoFillWithoutParams: FC<
  ShiftsAutoFillWithoutParamsProps
> = ({
  isAutoFillRunning,
  team,
  startDate,
  endDate,
  workerInconvenienceEquality,
  workerSlotEquality,
  workerSlotProximity,
  avoidNonWorkDayFirstShift,
  respectLeaveSchedule,
  requireMaximumIntervalBetweenShifts,
  maximumIntervalBetweenShifts,
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
  minimumNumberOfShiftsPerWeekInStandardWorkday,
  requireFirstShiftAfterExtendedLeave,
  firstShiftAfterExtendedLeaveMinimumDays,
  firstShiftAfterExtendedLeaveApplicableTypes,
  minimumRestSlotsAfterShift,
  onAssignShiftPositions,
  progress,
  onProgress,
}) => {
  const [shiftsAutoFillParamsResponse] = useQuery<{
    shiftsAutoFillParams: ShiftsAutoFillParams;
  }>({
    query: shiftsAutoFillParamsQuery,
    variables: {
      input: {
        team,
        startDay: startDate?.toString() ?? "",
        endDay: endDate?.nextDay().toString() ?? "",
      },
    },
    pause: !isAutoFillRunning || !startDate || !endDate,
  });

  const shiftsAutoFillParams =
    shiftsAutoFillParamsResponse?.data?.shiftsAutoFillParams;

  const { locale } = useLocale();
  const queriedDates = useRef<Array<DayDate | undefined>>([startDate, endDate]);

  useEffect(() => {
    if (!dequal(queriedDates.current, [startDate, endDate])) {
      onProgress(undefined);
      queriedDates.current = [startDate, endDate];
    }
  }, [startDate, endDate, onProgress]);

  useEffect(() => {
    let stopping = false;
    if (!isAutoFillRunning) {
      console.log("Auto fill is not running");
      return;
    }

    if (stopping) {
      console.log("Auto fill is stopping (1)");
      return;
    }
    if (!shiftsAutoFillParams) {
      console.log("No shifts auto fill params");
      return;
    }
    console.log("Auto fill is going to start");
    onProgress(undefined);
    const client = new SchedulerWorkerClient();
    const rules: Partial<Record<RuleName, unknown>> = {};
    if (requireMaximumIntervalBetweenShifts) {
      rules.minimumFrequency = maximumIntervalBetweenShifts * 24 * 60; // turn days into minutes
    }
    if (requireMinimumNumberOfShiftsPerWeekInStandardWorkday) {
      rules.minimumShiftsInStandardWorkdayPerWeek =
        minimumNumberOfShiftsPerWeekInStandardWorkday;
    }
    if (requireFirstShiftAfterExtendedLeave) {
      rules.firstShiftAfterExtendedLeave = {
        minimumContinuousDays: firstShiftAfterExtendedLeaveMinimumDays,
        applicableLeaveTypes: firstShiftAfterExtendedLeaveApplicableTypes,
      };
    }
    client.start(
      {
        startDay: startDate?.toString() ?? "",
        endDay: endDate?.nextDay().toString() ?? "",
        workers: shiftsAutoFillParams.workers,
        slots: shiftsAutoFillParams.slots.map((slot) => ({
          ...slot,
          startsOnDay: slot.startsOnDay,
        })),
        minimumRestSlotsAfterShift,
        keepTopSolutionsCount: 10,
        heuristics: {
          "Worker Inconvenience Equality": workerInconvenienceEquality,
          "Worker Slot Equality": workerSlotEquality,
          "Worker Slot Proximity": workerSlotProximity,
          "Avoid Non-Work Day First Shift": avoidNonWorkDayFirstShift,
        },
        respectLeaveSchedule,
        workSchedule: shiftsAutoFillParams.workSchedule,
        rules,
        locale,
      },
      (progress) => {
        console.log("Progress", progress);
        onProgress(progress);
      }
    );

    return () => {
      console.log("Auto fill is stopping (2)");
      stopping = true;
      client.stop();
    };
  }, [
    isAutoFillRunning,
    shiftsAutoFillParams,
    workerInconvenienceEquality,
    workerSlotEquality,
    workerSlotProximity,
    avoidNonWorkDayFirstShift,
    onProgress,
    respectLeaveSchedule,
    requireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShifts,
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    minimumNumberOfShiftsPerWeekInStandardWorkday,
    requireFirstShiftAfterExtendedLeave,
    firstShiftAfterExtendedLeaveMinimumDays,
    firstShiftAfterExtendedLeaveApplicableTypes,
    startDate,
    endDate,
    minimumRestSlotsAfterShift,
    locale,
  ]);

  const { data: shiftPositions } = useTeamShiftsQuery({
    team,
    startDay: startDate,
    endDay: endDate,
    pause: !isAutoFillRunning,
  });

  return (
    <div>
      {isAutoFillRunning && <Loading />}
      {progress && shiftPositions && (
        <Suspense>
          <ShiftsAutoFillProgress
            startDate={startDate}
            endDate={endDate}
            progress={progress}
            shiftPositions={shiftPositions?.shiftPositions}
            onAssignShiftPositions={onAssignShiftPositions}
            canAssignShiftPositions={!isAutoFillRunning}
          />
        </Suspense>
      )}
    </div>
  );
};

export interface ShiftsAutoFillProps {
  team: string;
  startRange: DayDateInterval;
  onAssignShiftPositions: () => void;
}

const defaultShiftAutoFillParams: Omit<
  ShiftAutoFillParamValues,
  "startDate" | "endDate"
> = {
  workerInconvenienceEquality: 50,
  workerSlotEquality: 50,
  workerSlotProximity: 50,
  avoidNonWorkDayFirstShift: 50,
  respectLeaveSchedule: true,
  requireMaximumIntervalBetweenShifts: false,
  maximumIntervalBetweenShifts: 10,
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: false,
  minimumNumberOfShiftsPerWeekInStandardWorkday: 1,
  requireFirstShiftAfterExtendedLeave: false,
  firstShiftAfterExtendedLeaveMinimumDays: 3,
  firstShiftAfterExtendedLeaveApplicableTypes: [],
  minimumRestSlotsAfterShift: [],
};

export const ShiftsAutoFill: FC<ShiftsAutoFillProps> = ({
  team,
  startRange,
  onAssignShiftPositions,
}) => {
  const [isAutoFillRunning, setIsAutoFillRunning] = useState(false);
  const [shiftAutoFillParams, setShiftAutoFillParams] = useLocalPreference<
    Omit<ShiftAutoFillParamValues, "startDate" | "endDate">
  >("shiftAutoFillParams", defaultShiftAutoFillParams);
  const [startDate, setStartDate] = useState<DayDate | undefined>(
    startRange.start
  );
  const [endDate, setEndDate] = useState<DayDate | undefined>(startRange.end);
  const setAllShiftAutoFillParams = useCallback(
    (params: ShiftAutoFillParamValues) => {
      const { startDate, endDate, ...rest } = params;
      setStartDate(startDate);
      setEndDate(endDate);
      setShiftAutoFillParams((prev) => ({ ...prev, ...rest }));
    },
    [setShiftAutoFillParams]
  );
  const [progress, setProgress] = useState<SchedulerState | undefined>();
  return (
    <>
      <Transition show={!isAutoFillRunning && !progress} appear>
        <div
          className="transition duration-300 ease-in data-closed:opacity-0 'data-enter:duration-100 data-enter:data-closed:-translate-x-full data-leave:duration-300 data-leave:data-closed:-translate-x-full"
          role="region"
          aria-label="Shift auto-fill parameters"
        >
          <ShiftAutoFillParams
            {...shiftAutoFillParams}
            startDate={startDate}
            endDate={endDate}
            onChange={setAllShiftAutoFillParams}
          />
        </div>
      </Transition>
      <div
        className="mt-5 flex items-center"
        role="toolbar"
        aria-label="Shift auto-fill controls"
      >
        {(isAutoFillRunning || !progress) && (
          <>
            <Button
              disabled={!startDate || !endDate}
              onClick={() => {
                setIsAutoFillRunning(!isAutoFillRunning);
              }}
              aria-label={
                isAutoFillRunning
                  ? "Stop searching for solutions"
                  : "Start searching for the best solution"
              }
            >
              {isAutoFillRunning ? (
                <Trans>Stop searching</Trans>
              ) : (
                <Trans>Start searching for the best solution</Trans>
              )}
            </Button>
            <div className="ml-5"></div>
          </>
        )}
        {!isAutoFillRunning && progress && (
          <Button
            onClick={() => setProgress(undefined)}
            aria-label="Reset auto-fill progress"
          >
            <Trans>Reset</Trans>
          </Button>
        )}
      </div>
      <Suspense>
        <ShiftsAutoFillWithoutParams
          isAutoFillRunning={isAutoFillRunning}
          team={team}
          startDate={startDate}
          endDate={endDate}
          workerInconvenienceEquality={
            shiftAutoFillParams.workerInconvenienceEquality
          }
          workerSlotEquality={shiftAutoFillParams.workerSlotEquality}
          workerSlotProximity={shiftAutoFillParams.workerSlotProximity}
          avoidNonWorkDayFirstShift={
            shiftAutoFillParams.avoidNonWorkDayFirstShift
          }
          respectLeaveSchedule={shiftAutoFillParams.respectLeaveSchedule}
          requireMaximumIntervalBetweenShifts={
            shiftAutoFillParams.requireMaximumIntervalBetweenShifts
          }
          maximumIntervalBetweenShifts={
            shiftAutoFillParams.maximumIntervalBetweenShifts
          }
          requireMinimumNumberOfShiftsPerWeekInStandardWorkday={
            shiftAutoFillParams.requireMinimumNumberOfShiftsPerWeekInStandardWorkday
          }
          minimumNumberOfShiftsPerWeekInStandardWorkday={
            shiftAutoFillParams.minimumNumberOfShiftsPerWeekInStandardWorkday
          }
          requireFirstShiftAfterExtendedLeave={
            shiftAutoFillParams.requireFirstShiftAfterExtendedLeave
          }
          firstShiftAfterExtendedLeaveMinimumDays={
            shiftAutoFillParams.firstShiftAfterExtendedLeaveMinimumDays
          }
          firstShiftAfterExtendedLeaveApplicableTypes={
            shiftAutoFillParams.firstShiftAfterExtendedLeaveApplicableTypes
          }
          minimumRestSlotsAfterShift={
            shiftAutoFillParams.minimumRestSlotsAfterShift
          }
          onAssignShiftPositions={onAssignShiftPositions}
          progress={progress}
          onProgress={setProgress}
        />
      </Suspense>
    </>
  );
};
