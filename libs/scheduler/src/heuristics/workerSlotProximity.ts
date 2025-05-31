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

export const calculateWorkerSlotProximities = (schedule: ShiftSchedule) => {
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

  const proximities = new Map<string, number>();

  // Calculate proximities between consecutive shifts for each worker
  for (const [worker, shifts] of workerShifts.entries()) {
    for (let i = 1; i < shifts.length; i++) {
      const proximityInShiftIndex =
        shifts[i].shiftIndex - shifts[i - 1].shiftIndex;
      const key = `${worker.pk}-${shifts[i - 1].shiftIndex}-${shifts[i].shiftIndex}`;
      proximities.set(
        key,
        proximityInShiftIndex / expectedShiftPeriodPerWorker
      );
    }
  }

  return proximities;
};

export const calculateWorkerSlotProximityDeviation = (
  schedule: ShiftSchedule
) => {
  const proximities = calculateWorkerSlotProximities(schedule);
  return stdDev(1, Array.from(proximities.values()));
};

export const workerSlotProximityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Proximity",
  eval: (schedule) => calculateWorkerSlotProximityDeviation(schedule),
};
