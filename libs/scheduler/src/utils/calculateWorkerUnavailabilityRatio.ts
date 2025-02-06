import { SlotWorker } from "../types";
import { ShiftSchedule } from "../types";
import { countTotalMinutesInSchedule } from "./countTotalMinutesInSchedule";
import { countTotalUniqueWorkers } from "./countTotalUniqueWorkers";
import { unavailableForWorkReasonsMinutesCount } from "./unavailableForWorkReasonsMinutesCount";

export const calculateWorkerUnavailabilityRatio = (
  schedule: ShiftSchedule
): [number, (worker: SlotWorker) => number] => {
  const totalMinutesInSchedule = countTotalMinutesInSchedule(schedule);
  const totalUniqueWorkerCount = countTotalUniqueWorkers(schedule);
  const expectedMinutesPerWorker =
    totalMinutesInSchedule / totalUniqueWorkerCount;
  return [
    expectedMinutesPerWorker,
    (worker: SlotWorker): number => {
      return (
        (totalMinutesInSchedule -
          unavailableForWorkReasonsMinutesCount(worker)) /
        totalMinutesInSchedule
      );
    },
  ];
};
