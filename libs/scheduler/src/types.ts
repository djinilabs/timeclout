export interface SlotWorkerLeave {
  start: number; // minutes, relative to start of period
  end: number; // minutes, relative to start of period
  type: string;
  isPersonal: boolean;
}

export interface SlotWorkHour {
  start: number; // minutes, relative to start of period
  end: number; // minutes, relative to start of period
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

export interface WorkSchedule {
  monday: { isWorkDay: boolean };
  tuesday: { isWorkDay: boolean };
  wednesday: { isWorkDay: boolean };
  thursday: { isWorkDay: boolean };
  friday: { isWorkDay: boolean };
  saturday: { isWorkDay: boolean };
  sunday: { isWorkDay: boolean };
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
  id: string;
  score: number;
  heuristicScores: HeuristicScore[];
  schedule: ShiftSchedule;
}

export type ValidationFunction = (
  schedule: ShiftSchedule,
  workers: SlotWorker[],
  ruleOptions: unknown
) => [valid: boolean, problemInSlotId?: string];

export type ValidationRule = {
  id: string;
  name: (ruleOptions: unknown) => string;
  function: ValidationFunction;
};

export interface EvaluateScheduleResult {
  finalScore: number;
  euristicScore: Array<{
    name: string;
    score: number;
  }>;
}
