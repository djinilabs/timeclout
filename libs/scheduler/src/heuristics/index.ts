import { workerInconvenienceEqualityHeuristic } from "./workerInconvenienceEquality";
import { workerSlotEqualityHeuristic } from "./workerSlotEquality";
import { workerSlotProximityHeuristic } from "./workerSlotProximity";

export const heuristics = [
  workerInconvenienceEqualityHeuristic,
  workerSlotProximityHeuristic,
  workerSlotEqualityHeuristic,
];

export { calculateWorkerInconveniences } from "./workerInconvenienceEquality";
export { calculateWorkerSlotMinutes } from "./workerSlotEquality";
export { calculateWorkerSlotProximities } from "./workerSlotProximity";
