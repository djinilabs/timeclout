import fs from "fs";
import { ScoredShiftSchedule } from "../types";

const generateCsv = (
  schedule: ScoredShiftSchedule,
  startingNumber = 1
): string => {
  const maxWorkerPerSlot = schedule.schedule.shifts.reduce(
    (acc, shift) => Math.max(acc, shift.assigned.length),
    0
  );
  // generate csv by hand
  const header = ["Slot", ...Array(maxWorkerPerSlot).fill("Worker")].join(",");
  const rows = schedule.schedule.shifts.map((shift, index) => {
    const workers = [
      ...shift.assigned.map((w) => `${w.name} (${w.id})`),
      ...Array(maxWorkerPerSlot - shift.assigned.length).fill(""),
    ];
    return [index + startingNumber, ...workers].join(",");
  });

  return [header, ...rows].join("\n");
};

export const saveSchedule = async (
  schedule: ScoredShiftSchedule,
  startingNumber = 1
): Promise<void> => {
  const csvData = generateCsv(schedule, startingNumber);

  fs.writeFileSync(
    `./output/schedule-${schedule.score}.csv`,
    csvData.toString()
  );
};
