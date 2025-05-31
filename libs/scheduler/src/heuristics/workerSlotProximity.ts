import { ShiftScheduleHeuristic, SlotWorker, ShiftSchedule } from "../types";
import { countTotalUniqueWorkers } from "../utils/countTotalUniqueWorkers";
import { stdDev } from "../utils/standardDeviation";

export const calculateExpectedWorkerSlotProximity = (
  schedule: ShiftSchedule
) => {
  const totalShiftCount = schedule.shifts.length;
  const totalWorkerCount = countTotalUniqueWorkers(schedule);
  return totalShiftCount / totalWorkerCount;
};

export const calculateWorkerSlotProximityDeviation = (
  schedule: ShiftSchedule
) => {
  const expectedShiftPeriodPerWorker =
    calculateExpectedWorkerSlotProximity(schedule);

  const workerShifts: Map<SlotWorker, { shiftIndex: number }[]> = new Map();

  // Group shifts by worker and sort by start time
  schedule.shifts.forEach((shift, shiftIndex) => {
    const shifts = workerShifts.get(shift.assigned) ?? [];
    shifts.push({
      shiftIndex,
    });
    workerShifts.set(shift.assigned, shifts);
  });

  // Sort shifts for each worker by start time
  for (const shifts of workerShifts.values()) {
    shifts.sort((a, b) => a.shiftIndex - b.shiftIndex);
  }

  const proximities: number[] = [];

  // Calculate proximities between consecutive shifts for each worker
  for (const shifts of workerShifts.values()) {
    for (let i = 1; i < shifts.length; i++) {
      const proximityInShiftIndex =
        shifts[i].shiftIndex - shifts[i - 1].shiftIndex;
      proximities.push(proximityInShiftIndex / expectedShiftPeriodPerWorker);
    }
  }

  return stdDev(1, proximities);
};

export const workerSlotProximityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Proximity",
  eval: (schedule) => calculateWorkerSlotProximityDeviation(schedule),
};
