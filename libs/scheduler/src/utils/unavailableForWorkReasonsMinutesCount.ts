import { SlotWorker } from "../types";

export const unavailableForWorkReasonsMinutesCount = (
  worker: SlotWorker
): number => {
  return worker.approvedLeaves.reduce(
    (acc, leave) => (leave.isPersonal ? acc : acc + (leave.end - leave.start)),
    0
  );
};
