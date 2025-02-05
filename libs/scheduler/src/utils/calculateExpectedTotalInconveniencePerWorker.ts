import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";
import { countTotalUniqueWorkers } from "./countTotalUniqueWorkers";
import { ShiftSchedule } from "../types";

export const calculateExpectedTotalInconveniencePerWorker = (
  schedule: ShiftSchedule
) => {
  const totalUniqueWorkerCount = countTotalUniqueWorkers(schedule);
  const totalSlotInconvenience = schedule.shifts.reduce(
    (inc, shift) =>
      inc +
      shift.slot.members.reduce(
        (inc, member) => inc + calculateSlotInconvenience(member),
        0
      ),
    0
  );
  return totalSlotInconvenience / totalUniqueWorkerCount;
};
