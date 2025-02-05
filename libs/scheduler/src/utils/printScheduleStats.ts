// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import Table from "ascii-table";
import { getDefined } from "@/utils";
import { ScoredShiftSchedule, SlotWorker } from "../types";
import { parseSlotWorker } from "../schema/slotWorker";
import { calculateSlotInconvenience } from "./calculateSlotInconvenience";
import { calculateExpectedTotalInconveniencePerWorker } from "./calculateExpectedTotalInconveniencePerWorker";

interface WorkerScheduleStats {
  worker: SlotWorker;
  shiftCount: number;
  inconvenientShiftScore: number;
}

const getWorkerScheduleStats = (
  schedule: ScoredShiftSchedule
): WorkerScheduleStats[] => {
  const workerStats = new Map<SlotWorker, WorkerScheduleStats>();
  for (const shift of schedule.schedule.shifts) {
    let index = 0;
    for (const worker of shift.assigned) {
      const stats = workerStats.get(worker) ?? {
        worker,
        shiftCount: 0,
        inconvenientShiftScore: 0,
      };
      stats.shiftCount += 1;
      const shiftInconvenience = calculateSlotInconvenience(
        getDefined(shift.slot.members[index], `Slot member ${index} not found`)
      );
      stats.inconvenientShiftScore += shiftInconvenience;
      workerStats.set(worker, stats);
      index++;
    }
  }

  return Array.from(workerStats.values());
};

export const printScheduleStats = (schedule: ScoredShiftSchedule): string => {
  const workerStats = getWorkerScheduleStats(schedule);
  const table = new Table("Schedule Stats");
  table.setHeading(
    "Worker",
    "Unavailable (work)",
    "Unavailable (personal)",
    "Total Shift #",
    "Inconvenience Score diff"
  );
  const expectedTotalInconveniencePerWorker =
    calculateExpectedTotalInconveniencePerWorker(schedule.schedule);
  workerStats.forEach((stats) => {
    const worker = parseSlotWorker({
      ...stats.worker,
      unavailableShiftsForWorkReasons: Array.from(
        (
          stats.worker as unknown as {
            unavailableShiftsForWorkReasons: number[];
          }
        ).unavailableShiftsForWorkReasons
      ),
      unavailableShiftsForPersonalReasons: Array.from(
        (
          stats.worker as unknown as {
            unavailableShiftsForPersonalReasons: number[];
          }
        ).unavailableShiftsForPersonalReasons
      ),
    });
    table.addRow(
      worker.name,
      worker.unavailableForWorkReasonsShiftCount(),
      worker.unavailableForPersonalReasonsShiftCount(),
      stats.shiftCount,
      `${Math.round(
        ((stats.inconvenientShiftScore - expectedTotalInconveniencePerWorker) /
          expectedTotalInconveniencePerWorker) *
          100
      )}%`
    );
  });
  return table.toString();
};
