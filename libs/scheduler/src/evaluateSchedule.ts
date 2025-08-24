import {
  ShiftScheduleHeuristicWithMultiplier,
  EvaluateScheduleResult,
 ShiftSchedule } from "./types";

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
    (accumulator, { priorityMultiplier }) => accumulator + (priorityMultiplier ?? 1),
    0
  );

  const finalScore =
    heuristicScores.reduce(
      (accumulator, { score, priorityMultiplier }) =>
        accumulator + score * (priorityMultiplier ?? 1),
      0
    ) / priorityMultiplierSum;

  return {
    finalScore,
    euristicScore: heuristicScores,
  };
};
