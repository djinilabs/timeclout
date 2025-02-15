import { useState, useEffect, FC, Suspense, useRef } from "react";
import { dequal } from "dequal";
import { SchedulerWorkerClient } from "@/scheduler-worker";
import { SchedulerState } from "@/scheduler";
import { DayDate, DayDateInterval } from "@/day-date";
import shiftsAutoFillParamsQuery from "@/graphql-client/queries/shiftsAutoFillParams.graphql";
import { ShiftsAutoFillParams } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { Button } from "./stateless/Button";
import { Loading } from "./stateless/Loading";
import { ShiftsAutoFillProgress } from "./stateless/ShiftsAutoFillProgress";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { Transition } from "@headlessui/react";
import {
  ShiftAutoFillParams,
  ShiftAutoFillParamValues,
} from "./stateless/ShiftAutoFillParams";
import { RuleName } from "@/scheduler";

export interface ShiftsAutoFillWithoutParamsProps {
  isAutoFillRunning: boolean;
  team: string;
  startDate: DayDate;
  endDate: DayDate;
  workerInconvenienceEquality: number;
  workerSlotEquality: number;
  workerSlotProximity: number;
  respectLeaveSchedule: boolean;
  requireMaximumIntervalBetweenShifts: boolean;
  maximumIntervalBetweenShifts: number;
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean;
  minimumNumberOfShiftsPerWeekInStandardWorkday: number;
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
  respectLeaveSchedule,
  requireMaximumIntervalBetweenShifts,
  maximumIntervalBetweenShifts,
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
  minimumNumberOfShiftsPerWeekInStandardWorkday,
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
        startDay: startDate.toString(),
        endDay: endDate.toString(),
      },
    },
    pause: !isAutoFillRunning,
  });

  const shiftsAutoFillParams =
    shiftsAutoFillParamsResponse?.data?.shiftsAutoFillParams;

  const queriedDates = useRef<DayDate[]>([startDate, endDate]);

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
      console.log("Auto fill is stopping");
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
    client.start(
      {
        workers: shiftsAutoFillParams.workers,
        slots: shiftsAutoFillParams.slots,
        minimumRestSlotsAfterShift: [],
        keepTopSolutionsCount: 10,
        heuristics: {
          "Worker Inconvenience Equality": workerInconvenienceEquality,
          "Worker Slot Equality": workerSlotEquality,
          "Worker Slot Proximity": workerSlotProximity,
        },
        respectLeaveSchedule,
        rules,
      },
      (progress) => {
        console.log("Progress", progress);
        onProgress(progress);
      }
    );

    return () => {
      console.log("Auto fill is stopping");
      stopping = true;
      client.stop();
    };
  }, [
    isAutoFillRunning,
    shiftsAutoFillParams,
    workerInconvenienceEquality,
    workerSlotEquality,
    workerSlotProximity,
    onProgress,
    respectLeaveSchedule,
    requireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShifts,
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    minimumNumberOfShiftsPerWeekInStandardWorkday,
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
        <ShiftsAutoFillProgress
          startDate={startDate}
          endDate={endDate}
          progress={progress}
          shiftPositions={shiftPositions}
          onAssignShiftPositions={onAssignShiftPositions}
          canAssignShiftPositions={!isAutoFillRunning}
        />
      )}
    </div>
  );
};

export interface ShiftsAutoFillProps {
  team: string;
  startRange: DayDateInterval;
  onAssignShiftPositions: () => void;
}

export const ShiftsAutoFill: FC<ShiftsAutoFillProps> = ({
  team,
  startRange,
  onAssignShiftPositions,
}) => {
  const [isAutoFillRunning, setIsAutoFillRunning] = useState(false);
  const [shiftAutoFillParams, setShiftAutoFillParams] =
    useState<ShiftAutoFillParamValues>({
      startDate: startRange.start,
      endDate: startRange.end,
      workerInconvenienceEquality: 0.5,
      workerSlotEquality: 0.5,
      workerSlotProximity: 0.5,
      respectLeaveSchedule: true,
      requireMaximumIntervalBetweenShifts: false,
      maximumIntervalBetweenShifts: 10,
      requireMinimumNumberOfShiftsPerWeekInStandardWorkday: false,
      minimumNumberOfShiftsPerWeekInStandardWorkday: 1,
    });
  const [progress, setProgress] = useState<SchedulerState | undefined>();
  return (
    <>
      <Transition show={!isAutoFillRunning && !progress} appear>
        <div className="transition duration-300 ease-in data-[closed]:opacity-0 'data-[enter]:duration-100 data-[enter]:data-[closed]:-translate-x-full data-[leave]:duration-300 data-[leave]:data-[closed]:-translate-x-full">
          <ShiftAutoFillParams
            initialStartDate={startRange.start}
            initialEndDate={startRange.end}
            initialWorkerInconvenienceEquality={
              shiftAutoFillParams?.workerInconvenienceEquality
            }
            initialWorkerSlotEquality={shiftAutoFillParams?.workerSlotEquality}
            initialWorkerSlotProximity={
              shiftAutoFillParams?.workerSlotProximity
            }
            initialRequireMaximumIntervalBetweenShifts={
              shiftAutoFillParams?.requireMaximumIntervalBetweenShifts
            }
            initialMaximumIntervalBetweenShifts={
              shiftAutoFillParams?.maximumIntervalBetweenShifts
            }
            initialRequireMinimumNumberOfShiftsPerWeekInStandardWorkday={
              shiftAutoFillParams?.requireMinimumNumberOfShiftsPerWeekInStandardWorkday
            }
            initialMinimumNumberOfShiftsPerWeekInStandardWorkday={
              shiftAutoFillParams?.minimumNumberOfShiftsPerWeekInStandardWorkday
            }
            onChange={setShiftAutoFillParams}
          />
        </div>
      </Transition>
      <div className="mt-5 flex items-center">
        {(isAutoFillRunning || !progress) && (
          <>
            <Button
              disabled={
                !shiftAutoFillParams?.startDate || !shiftAutoFillParams?.endDate
              }
              onClick={() => {
                setIsAutoFillRunning(!isAutoFillRunning);
              }}
            >
              {isAutoFillRunning
                ? "Stop searching"
                : "Start searching for the best solution"}
            </Button>
            <div className="ml-5"></div>
          </>
        )}
        {!isAutoFillRunning && progress && (
          <Button onClick={() => setProgress(undefined)}>Reset</Button>
        )}
      </div>
      <Suspense>
        <ShiftsAutoFillWithoutParams
          isAutoFillRunning={isAutoFillRunning}
          team={team}
          startDate={
            shiftAutoFillParams?.startDate
              ? shiftAutoFillParams.startDate
              : DayDate.today()
          }
          endDate={
            shiftAutoFillParams?.endDate
              ? shiftAutoFillParams.endDate
              : DayDate.today()
          }
          workerInconvenienceEquality={
            shiftAutoFillParams?.workerInconvenienceEquality
          }
          workerSlotEquality={shiftAutoFillParams?.workerSlotEquality}
          workerSlotProximity={shiftAutoFillParams?.workerSlotProximity}
          respectLeaveSchedule={shiftAutoFillParams?.respectLeaveSchedule}
          requireMaximumIntervalBetweenShifts={
            shiftAutoFillParams?.requireMaximumIntervalBetweenShifts
          }
          maximumIntervalBetweenShifts={
            shiftAutoFillParams?.maximumIntervalBetweenShifts
          }
          requireMinimumNumberOfShiftsPerWeekInStandardWorkday={
            shiftAutoFillParams?.requireMinimumNumberOfShiftsPerWeekInStandardWorkday
          }
          minimumNumberOfShiftsPerWeekInStandardWorkday={
            shiftAutoFillParams?.minimumNumberOfShiftsPerWeekInStandardWorkday
          }
          onAssignShiftPositions={onAssignShiftPositions}
          progress={progress}
          onProgress={setProgress}
        />
      </Suspense>
    </>
  );
};
