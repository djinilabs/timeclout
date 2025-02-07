export interface SlotWorkerLeave {
  start: number;
  end: number;
  type: string;
  isPersonal: boolean;
}

export interface SlotWorkHour {
  start: number;
  end: number;
  inconvenienceMultiplier: number;
}

export interface SlotWorker {
  pk: string;
  name: string;
  qualifications: string[];
  approvedLeaves: SlotWorkerLeave[];
}

export interface Slot {
  id: string;
  workHours: SlotWorkHour[];
  startsOnStandardWorkDay: boolean;
}

export type WorkSlots = Slot[];

export interface SlotShift {
  slot: Slot;
  assigned: SlotWorker;
}

export interface ShiftSchedule {
  shifts: Array<SlotShift>;
}

export interface ShiftScheduleHeuristic {
  name: string;
  eval: (schedule: ShiftSchedule) => number;
}

export interface ShiftScheduleHeuristicWithMultiplier
  extends ShiftScheduleHeuristic {
  priorityMultiplier?: number;
}

export interface HeuristicScore {
  name: string;
  score: number;
}

export interface ScoredShiftSchedule {
  score: number;
  heuristicScores: HeuristicScore[];
  schedule: ShiftSchedule;
}

export type ValidationRule = (
  schedule: ShiftSchedule,
  workers: SlotWorker[],
  ruleOptions: unknown
) => boolean;
