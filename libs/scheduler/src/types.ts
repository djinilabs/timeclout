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
  email: string;
  emailMd5: string;
  qualifications: string[];
  approvedLeaves: SlotWorkerLeave[];
}

export interface Slot {
  id: string;
  workHours: SlotWorkHour[];
  startsOnDay: string;
  assignedWorkerPk?: string | null;
  requiredQualifications: string[];
  typeName: string;
}

export type WorkSlots = Slot[];

export interface SlotShift {
  slot: Slot;
  assigned: SlotWorker;
}

export interface ShiftSchedule {
  startDay: string;
  endDay: string;
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
