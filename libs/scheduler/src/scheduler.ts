import { getDefined } from "@/utils";
import { evaluateSchedule } from "./evaluateSchedule";
import { isScheduleValid } from "./rules";
import { RuleName } from "./rules/types";
import { randomSchedule } from "./schedule";
import {
  ScoredShiftSchedule,
  ShiftScheduleHeuristicWithMultiplier,
  Slot,
  SlotWorker,
} from "./types";
import { sortByScore } from "./utils/sortByScore";
import { heuristics as realHeuristics } from "./heuristics";

export interface SchedulerSubscriptionOptions {
  interval: number;
}

export interface SchedulerState {
  cycleCount: number;
  discardedReasons: Map<string, number>;
  computed: number;
  topSolutions: ScoredShiftSchedule[];
}

export interface SchedulerListener {
  (state: SchedulerState): void;
}

export interface SchedulerOptions {
  keepTopSolutionsCount: number;
  heuristics: Record<string, number>;
  rules: Partial<Record<RuleName, unknown>>;
  workers: SlotWorker[];
  slots: Slot[];
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestSlots: number;
  }[];
}

export class Scheduler {
  private options: SchedulerOptions;
  private _stop = false;

  private heuristics: ShiftScheduleHeuristicWithMultiplier[];
  private rules: Partial<Record<RuleName, unknown>>;
  private workers: SlotWorker[];
  private slots: Slot[];
  private minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestSlots: number;
  }[];

  private topSolutions: ScoredShiftSchedule[] = [];
  private discardedReasons = new Map<string, number>();
  private cycleCount = 0;
  private computed = 0;

  constructor(options: SchedulerOptions) {
    this.options = options;
    this.heuristics = Object.entries(options.heuristics).map(
      ([name, multiplier]) => ({
        ...getDefined(
          realHeuristics.find((h) => h.name === name),
          `Heuristic ${name} not found`
        ),
        priorityMultiplier: multiplier,
      })
    );
    this.rules = options.rules;
    this.workers = options.workers;
  }

  private async cycle() {
    try {
      this.cycleCount += 1;
      const schedule = randomSchedule({
        workers: this.workers,
        slots: this.slots,
        minimumRestSlotsAfterShift: this.minimumRestSlotsAfterShift,
        rules: this.rules,
      });

      const [valid, reason] = isScheduleValid(
        schedule,
        this.workers,
        this.rules
      );
      if (!valid) {
        this.discardedReasons.set(
          reason,
          (this.discardedReasons.get(reason) ?? 0) + 1
        );
        return;
      }
      this.computed += 1;
      const evalResult = evaluateSchedule(schedule, this.heuristics);
      this.topSolutions.push({
        score: evalResult.finalScore,
        heuristicScores: evalResult.euristicScore,
        schedule,
      });
      this.topSolutions = this.topSolutions
        .sort(sortByScore)
        .slice(0, this.options.keepTopSolutionsCount);
    } catch (err) {
      const reason = `Error: ${(err as Error).message}`;
      this.discardedReasons.set(
        reason,
        (this.discardedReasons.get(reason) ?? 0) + 1
      );
      // do nothing
    }
  }

  subscribe(
    listener: SchedulerListener,
    options: SchedulerSubscriptionOptions
  ) {
    const interval = setInterval(() => {
      listener({
        cycleCount: this.cycleCount,
        discardedReasons: this.discardedReasons,
        computed: this.computed,
        topSolutions: this.topSolutions,
      });
    }, options.interval);

    return () => clearInterval(interval);
  }

  async start() {
    this._stop = false;
    while (!this._stop) {
      await this.cycle();
    }
  }

  stop() {
    this._stop = true;
  }
}
