import { workerExperienceEqualityHeuristic } from "./workerExperienceEquality";
import { workerInconvenienceEqualityHeuristic } from "./workerInconvenienceEquality";
import { workerSlotEqualityHeuristic } from "./workerSlotEquality";
import { workerSlotProximityHeuristic } from "./workerSlotProximity";

export const heuristics = [
  workerInconvenienceEqualityHeuristic,
  workerSlotProximityHeuristic,
  workerExperienceEqualityHeuristic,
  workerSlotEqualityHeuristic,
];
