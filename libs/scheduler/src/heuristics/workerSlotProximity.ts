import { ShiftScheduleHeuristic, ShiftSchedule, Slot } from "../types";
import { countTotalUniqueWorkers } from "../utils/countTotalUniqueWorkers";
import { stdDev as standardDeviation } from "../utils/standardDeviation";

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
  for (const [shiftIndex, shift] of schedule.shifts.entries()) {
    const shifts = workerShifts.get(shift.assigned.pk) ?? [];
    shifts.push({
      shiftIndex,
      slot: shift.slot,
    });
    workerShifts.set(shift.assigned.pk, shifts);
  }

  // Sort shifts for each worker by start time
  for (const shifts of workerShifts.values()) {
    shifts.sort((a, b) => a.shiftIndex - b.shiftIndex);
  }

  const proximities = new Map<string, number>();

  // Calculate proximities between consecutive shifts for each worker
  for (const [worker, shifts] of workerShifts.entries()) {
    for (let index = 1; index < shifts.length; index++) {
      const currentSlot = shifts[index].slot;
      const proximityInShiftIndex =
        shifts[index].shiftIndex - shifts[index - 1].shiftIndex;
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
  return standardDeviation(1, [...proximities.values()]);
};

export const workerSlotProximityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Proximity",
  eval: (schedule) => calculateWorkerSlotProximityDeviation(schedule),
};
