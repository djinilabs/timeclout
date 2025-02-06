import { ShiftScheduleHeuristic, SlotWorker } from "../types";
import { countTotalMinutesInSchedule } from "../utils/countTotalMinutesInSchedule";
import { countTotalMinutesInSlot } from "../utils/countTotalMinutesInSlot";
import { countTotalUniqueWorkers } from "../utils/countTotalUniqueWorkers";
import { stdDev } from "../utils/standardDeviation";

export const workerSlotProximityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Slot Proximity",
  eval: (schedule) => {
    // Here we want to calculate the standard deviation of the proximity between each consecutive shift for each worker
    // The proximity is the difference in minutes between the start of the current shift and the end of the previous shift
    // We want to minimize this standard deviation
    // First, we need to calculate the expected proximity (also in minutes) between each consecutive shift for each worker
    const totalMinutesInSchedule = countTotalMinutesInSchedule(schedule);
    const totalUniqueWorkerCount = countTotalUniqueWorkers(schedule);

    // Calculate average shift length
    let totalShiftLength = 0;
    for (const shift of schedule.shifts) {
      totalShiftLength += countTotalMinutesInSlot(shift.slot);
    }
    const averageShiftLength = totalShiftLength / schedule.shifts.length;

    // Expected proximity should account for both total time and shift lengths
    const expectedProximityPerWorker =
      (totalMinutesInSchedule - averageShiftLength * schedule.shifts.length) /
      totalUniqueWorkerCount;

    const workerShifts: Map<
      SlotWorker,
      { durationInMinutes: number; startTime: number }[]
    > = new Map();

    // Group shifts by worker and sort by start time
    for (const shift of schedule.shifts) {
      const shifts = workerShifts.get(shift.assigned) ?? [];
      shifts.push({
        durationInMinutes: countTotalMinutesInSlot(shift.slot),
        startTime: shift.slot.workHours[0].start,
      });
      workerShifts.set(shift.assigned, shifts);
    }

    // Sort shifts for each worker by start time
    for (const shifts of workerShifts.values()) {
      shifts.sort((a, b) => a.startTime - b.startTime);
    }

    const proximities: number[] = [];

    // Calculate proximities between consecutive shifts for each worker
    for (const shifts of workerShifts.values()) {
      for (let i = 1; i < shifts.length; i++) {
        const previousShiftEnd =
          shifts[i - 1].startTime + shifts[i - 1].durationInMinutes * 60 * 1000;
        const currentShiftStart = shifts[i].startTime;
        const proximityInMinutes =
          (currentShiftStart - previousShiftEnd) / (60 * 1000);
        proximities.push(proximityInMinutes / expectedProximityPerWorker);
      }
    }

    return stdDev(1, proximities);
  },
};
