import { Button } from "./Button";
import { useState, useEffect } from "react";
import { SchedulerWorkerClient } from "@/scheduler-worker";

export const ShiftsAutoFill = () => {
  const [isAutoFillRunning, setIsAutoFillRunning] = useState(false);

  useEffect(() => {
    if (!isAutoFillRunning) {
      console.log("Auto fill is not running");
      return;
    }
    console.log("Auto fill is going to start");
    const client = new SchedulerWorkerClient();
    client.start({
      workers: [],
      slots: [],
      minimumRestSlotsAfterShift: [],
      keepTopSolutionsCount: 10,
      heuristics: {},
      rules: {},
    });

    return () => {
      console.log("Auto fill is stopping");
      client.stop();
    };
  }, [isAutoFillRunning]);

  return (
    <div>
      <Button
        onClick={() => {
          setIsAutoFillRunning(!isAutoFillRunning);
        }}
      >
        {isAutoFillRunning ? "Stop Auto Fill" : "Start Auto Fill"}
      </Button>
    </div>
  );
};
