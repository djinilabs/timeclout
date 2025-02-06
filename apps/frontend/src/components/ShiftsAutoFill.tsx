import { Button } from "./Button";
import { useState, useEffect, FC } from "react";
import { SchedulerWorkerClient } from "@/scheduler-worker";
import { DateRange, DayPicker } from "react-day-picker";
import { useQuery } from "../hooks/useQuery";
import shiftsAutoFillParamsQuery from "@/graphql-client/queries/shiftsAutoFillParams.graphql";
import { ShiftsAutoFillParams } from "../graphql/graphql";
export interface ShiftsAutoFillProps {
  team: string;
  startRange: DateRange;
}

export const ShiftsAutoFill: FC<ShiftsAutoFillProps> = ({
  team,
  startRange,
}) => {
  const [isAutoFillRunning, setIsAutoFillRunning] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    startRange
  );

  const [shiftsAutoFillParamsResponse] = useQuery<{
    shiftsAutoFillParams: ShiftsAutoFillParams;
  }>({
    query: shiftsAutoFillParamsQuery,
    variables: {
      input: {
        team,
        startDay: selectedRange?.from?.toISOString().split("T")[0],
        endDay: selectedRange?.to?.toISOString().split("T")[0],
      },
    },
    pause: !isAutoFillRunning,
  });

  const shiftsAutoFillParams =
    shiftsAutoFillParamsResponse?.data?.shiftsAutoFillParams;

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
    const client = new SchedulerWorkerClient();
    client.start({
      workers: shiftsAutoFillParams.workers,
      slots: shiftsAutoFillParams.slots,
      minimumRestSlotsAfterShift: [],
      keepTopSolutionsCount: 10,
      heuristics: {},
      rules: {},
    });

    return () => {
      console.log("Auto fill is stopping");
      stopping = true;
      client.stop();
    };
  }, [isAutoFillRunning, shiftsAutoFillParams]);

  return (
    <div>
      <DayPicker
        mode="range"
        ISOWeek
        timeZone="UTC"
        numberOfMonths={2}
        selected={selectedRange}
        onSelect={(range) => {
          setSelectedRange(range);
        }}
      />
      <Button
        disabled={!selectedRange}
        onClick={() => {
          setIsAutoFillRunning(!isAutoFillRunning);
        }}
      >
        {isAutoFillRunning ? "Stop Auto Fill" : "Start Auto Fill"}
      </Button>
    </div>
  );
};
