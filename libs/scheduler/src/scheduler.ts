import { getDefined, timeout } from "@/utils";
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
import { random } from "nanoid";
import { dequal } from "dequal";

export interface SchedulerSubscriptionOptions {
  interval: number;
}

export interface SchedulerState {
  cycleCount: number;
  discardedReasons: Map<string, number>;
  problemInSlotIds: Map<string, number>;
  computed: number;
  topSolutions: ScoredShiftSchedule[];
}

export interface SchedulerListener {
  (state: SchedulerState): void;
}

export interface SchedulerOptions {
  startDay: string;
  endDay: string;
  keepTopSolutionsCount: number;
  heuristics: Record<string, number>;
  rules: Partial<Record<RuleName, unknown>>;
  workers: SlotWorker[];
  slots: Slot[];
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
  respectLeaveSchedule: boolean;
  locale?: string;
}

const hex = (uint8: Uint8Array) => {
  return Array.from(uint8)
    .map((i) => i.toString(16).padStart(2, "0"))
    .join("");
};

export class Scheduler {
  private options: SchedulerOptions;
  private _stop = false;

  private startDay: string;
  private endDay: string;
  private respectLeaveSchedule: boolean;
  private heuristics: ShiftScheduleHeuristicWithMultiplier[];
  private rules: Partial<Record<RuleName, unknown>>;
  private workers: SlotWorker[];
  private slots: Slot[];
  private minimumRestMinutesAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];

  private topSolutions: ScoredShiftSchedule[] = [];
  private discardedReasons = new Map<string, number>();
  private problemInSlotIds = new Map<string, number>();
  private cycleCount = 0;
  private computed = 0;
  private lastBreaks = 0;

  constructor(options: SchedulerOptions) {
    this.options = options;
    this.startDay = options.startDay;
    this.endDay = options.endDay;
    this.heuristics = Object.entries(options.heuristics).map(
      ([name, multiplier]) => ({
        ...getDefined(
          realHeuristics.find((h) => h.name === name),
          `Heuristic ${name} not found`
        ),
        priorityMultiplier: multiplier,
      })
    );
    this.respectLeaveSchedule = options.respectLeaveSchedule;
    this.rules = options.rules;
    this.workers = options.workers;
    this.slots = options.slots;
    this.minimumRestMinutesAfterShift = options.minimumRestSlotsAfterShift;
  }

  private async cycle() {
    try {
      this.cycleCount += 1;
      const schedule = randomSchedule({
        startDay: this.startDay,
        endDay: this.endDay,
        workers: this.workers,
        slots: this.slots,
        minimumRestSlotsAfterShift: this.minimumRestMinutesAfterShift,
        rules: this.rules,
        respectLeaveSchedule: this.respectLeaveSchedule,
      });

      const [valid, reason, problemInSlotId] = isScheduleValid(
        schedule,
        this.workers,
        this.rules
      );
      if (!valid) {
        this.discardedReasons.set(
          reason,
          (this.discardedReasons.get(reason) ?? 0) + 1
        );
        if (problemInSlotId) {
          this.problemInSlotIds.set(
            problemInSlotId,
            (this.problemInSlotIds.get(problemInSlotId) ?? 0) + 1
          );
        }
        return;
      }
      this.computed += 1;
      const evalResult = evaluateSchedule(schedule, this.heuristics);
      if (!this.topSolutions.find((s) => dequal(s.schedule, schedule))) {
        this.topSolutions.push({
          id: hex(random(20)),
          score: evalResult.finalScore,
          heuristicScores: evalResult.euristicScore,
          schedule,
        });
        this.topSolutions = this.topSolutions
          .sort(sortByScore)
          .slice(0, this.options.keepTopSolutionsCount);
      }
    } catch (err) {
      // console.error(err);
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
        problemInSlotIds: this.problemInSlotIds,
        computed: this.computed,
        topSolutions: this.topSolutions,
      });
    }, options.interval);

    return () => clearInterval(interval);
  }

  timeSinceLastBreak() {
    return Date.now() - this.lastBreaks;
  }

  async start() {
    this._stop = false;
    while (!this._stop) {
      await this.cycle();
      if (this.cycleCount % 10 === 0) {
        if (this.timeSinceLastBreak() > 1000) {
          this.lastBreaks = Date.now();
          await timeout(20);
        }
      }
    }
  }

  stop() {
    this._stop = true;
  }
}
