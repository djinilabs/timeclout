import {
  ScoredShiftSchedule,
  ShiftScheduleHeuristicWithMultiplier,
  Slot,
  SlotWorker,
} from "./types";
import { randomSchedule } from "./schedule";
import { isScheduleValid } from "./rules";
import { RuleName } from "./rules/types";
import { heuristics as realHeuristics } from "./heuristics";
import { getDefined } from "@/utils";
import { sortByScore } from "./utils/sortByScore";
import { evaluateSchedule } from "./evaluateSchedule";

export interface SearchForBestSchedulesOptions {
  startDay: string;
  endDay: string;
  workers: SlotWorker[];
  slots: Slot[];
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
  maxTryCount: number;
  keepTopCount: number;
  heuristics: Record<string, number>;
  rules: Partial<Record<RuleName, unknown>>;
}

export interface EvaluateScheduleResult {
  finalScore: number;
  euristicScore: Array<{
    name: string;
    score: number;
  }>;
}

export const searchForBestSchedules = ({
  startDay,
  endDay,
  workers,
  slots,
  minimumRestSlotsAfterShift,
  maxTryCount,
  keepTopCount,
  heuristics: _heuristics,
  rules,
}: SearchForBestSchedulesOptions): Array<ScoredShiftSchedule> => {
  let top: Array<ScoredShiftSchedule> = [];
  const discardedReasons = new Map<string, number>();
  const problemInSlotIds = new Map<string, number>();
  const heuristics: ShiftScheduleHeuristicWithMultiplier[] = Object.entries(
    _heuristics
  ).map(([heuristicName, multiplier]) => ({
    ...getDefined(
      realHeuristics.find((h) => h.name === heuristicName),
      `Heuristic ${heuristicName} not found`
    ),
    priorityMultiplier: multiplier,
  }));
  for (let i = 0; i < maxTryCount; i++) {
    try {
      const schedule = randomSchedule({
        startDay,
        endDay,
        workers,
        slots,
        minimumRestSlotsAfterShift,
        rules,
        respectLeaveSchedule: true,
      });

      const [valid, reason, problemInSlotId] = isScheduleValid(
        schedule,
        workers,
        rules
      );
      if (!valid) {
        discardedReasons.set(reason, (discardedReasons.get(reason) ?? 0) + 1);
        if (problemInSlotId) {
          problemInSlotIds.set(
            problemInSlotId,
            (problemInSlotIds.get(problemInSlotId) ?? 0) + 1
          );
        }
        continue;
      }
      const evalResult = evaluateSchedule(schedule, heuristics);
      top.push({
        score: evalResult.finalScore,
        heuristicScores: evalResult.euristicScore,
        schedule,
      });
      top = top.sort(sortByScore).slice(0, keepTopCount);
    } catch (err) {
      const reason = `Error: ${(err as Error).message}`;
      discardedReasons.set(reason, (discardedReasons.get(reason) ?? 0) + 1);
      // do nothing
    }
  }

  return top;
};
