import { parentPort } from "worker_threads";
import { searchForBestSchedules } from "./searchForBestSchedules";
import { SlotWorker } from "./types";
import { Slot } from "./types";
import { parseSlotWorker } from "./schema/slotWorker";

if (!parentPort) {
  throw new Error("This module must be run as a worker");
}

parentPort.on(
  "message",
  (data: {
    workers: SlotWorker[];
    slots: Slot[];
    workersPerSlot: number;
    slotWeights: number[];
    maxTryCount: number;
    keepTopCount: number;
    minimumRestSlotsAfterShift: {
      inconvenienceLessOrEqualThan: number;
      minimumRestSlots: number;
    }[];
    rules: any;
    heuristics: any;
  }) => {
    const schedules = searchForBestSchedules({
      workers: data.workers.map(parseSlotWorker),
      slots: data.slots,
      maxTryCount: data.maxTryCount,
      keepTopCount: data.keepTopCount,
      minimumRestSlotsAfterShift: data.minimumRestSlotsAfterShift,
      rules: data.rules,
      heuristics: data.heuristics,
    });

    parentPort!.postMessage(schedules);
  }
);
