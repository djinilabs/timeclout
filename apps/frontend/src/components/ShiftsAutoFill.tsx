import { useState, useEffect, FC, Suspense, useRef } from "react";
import { SchedulerWorkerClient } from "@/scheduler-worker";
import { DateRange, DayPicker } from "react-day-picker";
import { useQuery } from "../hooks/useQuery";
import shiftsAutoFillParamsQuery from "@/graphql-client/queries/shiftsAutoFillParams.graphql";
import { ShiftsAutoFillParams } from "../graphql/graphql";
import { Button } from "./stateless/Button";
import { Loading } from "./stateless/Loading";
import { ShiftsAutoFillProgress } from "./stateless/ShiftsAutoFillProgress";
import { SchedulerState } from "@/scheduler";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { DayDate } from "@/day-date";
import { dequal } from "dequal";
import { classNames } from "../utils/classNames";

export interface ShiftsAutoFillWithoutParamsProps {
  isAutoFillRunning: boolean;
  team: string;
  startDate: DayDate;
  endDate: DayDate;
  onAssignShiftPositions: () => void;
}

export const ShiftsAutoFillWithoutParams: FC<
  ShiftsAutoFillWithoutParamsProps
> = ({
  isAutoFillRunning,
  team,
  startDate,
  endDate,
  onAssignShiftPositions,
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

  const [progress, setProgress] = useState<SchedulerState | undefined>();

  const queriedDates = useRef<DayDate[]>([startDate, endDate]);

  useEffect(() => {
    if (!dequal(queriedDates.current, [startDate, endDate])) {
      setProgress(undefined);
      queriedDates.current = [startDate, endDate];
    }
  }, [startDate, endDate]);

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
    setProgress(undefined);
    const client = new SchedulerWorkerClient();
    client.start(
      {
        workers: shiftsAutoFillParams.workers,
        slots: shiftsAutoFillParams.slots,
        minimumRestSlotsAfterShift: [],
        keepTopSolutionsCount: 10,
        heuristics: {
          "Worker Inconvenience Equality": 1,
          "Worker Slot Equality": 1,
          "Worker Slot Proximity": 1,
        },
        rules: {},
      },
      (progress) => {
        console.log("Progress", progress);
        setProgress(progress);
      }
    );

    return () => {
      console.log("Auto fill is stopping");
      stopping = true;
      client.stop();
    };
  }, [isAutoFillRunning, shiftsAutoFillParams]);

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
        />
      )}
    </div>
  );
};

export interface ShiftsAutoFillProps {
  team: string;
  startRange: DateRange;
  onAssignShiftPositions: () => void;
}

export const ShiftsAutoFill: FC<ShiftsAutoFillProps> = ({
  team,
  startRange,
  onAssignShiftPositions,
}) => {
  const [isAutoFillRunning, setIsAutoFillRunning] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    startRange
  );

  return (
    <>
      <div
        className={classNames(
          isAutoFillRunning && "h-0 overflow-hidden",
          "mb-5"
        )}
      >
        <DayPicker
          mode="range"
          ISOWeek
          timeZone="UTC"
          numberOfMonths={2}
          defaultMonth={startRange.from}
          selected={selectedRange}
          onSelect={(range) => {
            setSelectedRange(range);
          }}
        />
      </div>
      <Button
        disabled={!selectedRange}
        onClick={() => {
          setIsAutoFillRunning(!isAutoFillRunning);
        }}
      >
        {isAutoFillRunning
          ? "Stop Auto Fill"
          : "Start Auto Fill for selected dates"}
      </Button>
      <Suspense>
        <ShiftsAutoFillWithoutParams
          isAutoFillRunning={isAutoFillRunning}
          team={team}
          startDate={
            selectedRange?.from
              ? new DayDate(selectedRange.from)
              : DayDate.today()
          }
          endDate={
            selectedRange?.to ? new DayDate(selectedRange.to) : DayDate.today()
          }
          onAssignShiftPositions={onAssignShiftPositions}
        />
      </Suspense>
    </>
  );
};
