import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";
import { countTotalUniqueWorkers } from "./countTotalUniqueWorkers";
import { ShiftSchedule } from "../types";

export const calculateExpectedTotalInconveniencePerWorker = (
  schedule: ShiftSchedule
) => {
  const totalUniqueWorkerCount = countTotalUniqueWorkers(schedule);
  const totalSlotInconvenience = schedule.shifts.reduce(
    (inc, shift) => inc + calculateSlotInconvenience(shift.slot),
    0
  );
  return totalSlotInconvenience / totalUniqueWorkerCount;
};
