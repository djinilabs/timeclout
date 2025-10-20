import { avoidNonWorkDayFirstShiftHeuristic } from "./avoidNonWorkDayFirstShift";
import { workerInconvenienceEqualityHeuristic } from "./workerInconvenienceEquality";
import { workerSlotEqualityHeuristic } from "./workerSlotEquality";
import { workerSlotProximityHeuristic } from "./workerSlotProximity";

export const heuristics = [
  workerInconvenienceEqualityHeuristic,
  workerSlotProximityHeuristic,
  workerSlotEqualityHeuristic,
  avoidNonWorkDayFirstShiftHeuristic,
];

export {
  calculateAvoidNonWorkDayFirstShiftDeviation,
  createAvoidNonWorkDayFirstShiftHeuristic,
} from "./avoidNonWorkDayFirstShift";
export { calculateWorkerInconveniences } from "./workerInconvenienceEquality";
export { calculateWorkerSlotMinutes } from "./workerSlotEquality";
export { calculateWorkerSlotProximities } from "./workerSlotProximity";
