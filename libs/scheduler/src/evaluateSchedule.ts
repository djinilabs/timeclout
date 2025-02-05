import { EvaluateScheduleResult } from "./searchForBestSchedules";
import { ShiftScheduleHeuristicWithMultiplier } from "./types";
import { ShiftSchedule } from "./types";

export const evaluateSchedule = (
  schedule: ShiftSchedule,
  heuristics: ShiftScheduleHeuristicWithMultiplier[]
): EvaluateScheduleResult => {
  const heuristicScores = heuristics.map((heuristic) => ({
    name: heuristic.name,
    score: heuristic.eval(schedule),
    priorityMultiplier: heuristic.priorityMultiplier,
  }));

  return {
    finalScore: heuristicScores.reduce(
      (acc, { score, priorityMultiplier }) =>
        acc + score * (priorityMultiplier ?? 1),
      0
    ),
    euristicScore: heuristicScores,
  };
};
