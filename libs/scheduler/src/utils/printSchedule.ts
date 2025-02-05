// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import Table from "ascii-table";
import { type ShiftSchedule } from "../types";
import { calculateSlotInconvenience } from "./calculateSlotInconvenience";
import { getDefined } from "./getDefined";

export const printSchedule = (
  schedule: ShiftSchedule,
  startingNumber = 1
): string => {
  const table = new Table("Schedule");
  const maxWorkerPerSlot = Math.max(
    ...schedule.shifts.map((shift) => shift.assigned.length)
  );
  table.setHeading(
    "Slot",
    `Worker${maxWorkerPerSlot > 1 ? "s" : ""}`,
    ...Array.from({ length: (maxWorkerPerSlot - 1) * 2 + 1 }, () => ""),
    "Max Experience",
    "Average Experience"
  );
  schedule.shifts.forEach((shift, slot) => {
    const workers = shift.assigned.map((worker, index) => [
      `${worker.name} ${worker.id}`,
      calculateSlotInconvenience(
        getDefined(shift.slot.members[index], `Slot member ${index} not found`)
      ),
    ]);
    table.addRow(
      slot + startingNumber,
      ...workers.flat(),
      shift.assigned.reduce(
        (acc, worker) => Math.max(acc, worker.experience),
        0
      ),
      Math.round(
        (shift.assigned.reduce((acc, worker) => acc + worker.experience, 0) /
          shift.assigned.length) *
          100
      ) / 100
    );
  });
  return table.toString();
};
