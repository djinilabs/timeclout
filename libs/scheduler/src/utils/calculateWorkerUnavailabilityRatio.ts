import { SlotWorker , ShiftSchedule } from "../types";

import { countTotalMinutesInSchedule } from "./countTotalMinutesInSchedule";
import { countTotalUniqueWorkers } from "./countTotalUniqueWorkers";
import { unavailableForWorkReasonsMinutesCount } from "./unavailableForWorkReasonsMinutesCount";

export const calculateWorkerUnavailabilityRatio = (
  schedule: ShiftSchedule
): [number, (worker: string) => number] => {
  const workerMap = new Map<string, SlotWorker>();
  for (const shift of schedule.shifts) {
    workerMap.set(shift.assigned.pk, shift.assigned);
  }
  const totalMinutesInSchedule = countTotalMinutesInSchedule(schedule);
  const totalUniqueWorkerCount = countTotalUniqueWorkers(schedule);
  const expectedMinutesPerWorker =
    totalMinutesInSchedule / totalUniqueWorkerCount;
  return [
    expectedMinutesPerWorker,
    (workerPk: string): number => {
      const worker = workerMap.get(workerPk);
      if (!worker) {
        return 0;
      }
      return (
        (totalMinutesInSchedule -
          unavailableForWorkReasonsMinutesCount(worker)) /
        totalMinutesInSchedule
      );
    },
  ];
};
