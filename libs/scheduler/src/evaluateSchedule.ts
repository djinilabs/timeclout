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

  const priorityMultiplierSum = heuristicScores.reduce(
    (acc, { priorityMultiplier }) => acc + (priorityMultiplier ?? 1),
    0
  );

  const finalScore =
    heuristicScores.reduce(
      (acc, { score, priorityMultiplier }) =>
        acc + score * (priorityMultiplier ?? 1),
      0
    ) / priorityMultiplierSum;

  return {
    finalScore,
    euristicScore: heuristicScores,
  };
};
