import { ShiftScheduleHeuristic, ShiftSchedule, Slot } from "../types";
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

  const workerShifts: Map<string, { shiftIndex: number; slot: Slot }[]> =
    new Map();

  // Group shifts by worker and sort by start time
  schedule.shifts.forEach((shift, shiftIndex) => {
    const shifts = workerShifts.get(shift.assigned.pk) ?? [];
    shifts.push({
      shiftIndex,
      slot: shift.slot,
    });
    workerShifts.set(shift.assigned.pk, shifts);
  });

  // Sort shifts for each worker by start time
  for (const shifts of workerShifts.values()) {
    shifts.sort((a, b) => a.shiftIndex - b.shiftIndex);
  }

  const proximities = new Map<string, number>();

  // Calculate proximities between consecutive shifts for each worker
  for (const [worker, shifts] of workerShifts.entries()) {
    for (let i = 1; i < shifts.length; i++) {
      const currentSlot = shifts[i].slot;
      const proximityInShiftIndex =
        shifts[i].shiftIndex - shifts[i - 1].shiftIndex;
      const key = `${worker}//${currentSlot.id}`;
      if (proximities.has(key)) {
        console.warn(`Duplicate for slot ${currentSlot.id} key: ${key}`);
      }
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
