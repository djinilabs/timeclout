import { SlotWorker } from "../types";

export const unavailableForWorkReasonsMinutesCount = (
  worker: SlotWorker
): number => {
  return worker.approvedLeaves.reduce(
    (accumulator, leave) => (leave.isPersonal ? accumulator : accumulator + (leave.end - leave.start)),
    0
  );
};
