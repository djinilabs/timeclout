export interface SlotWorker {
  id: string;
  name: string;
  qualifications: string[];
  approvedLeaves: LeaveRequest[];
  isAvailableToWork(shift: number): boolean;
  unavailableForWorkReasonsShiftCount(): number;
  unavailableForPersonalReasonsShiftCount(): number;
}

export interface WorkHour {
  start: number;
  end: number;
  inconvenienceMultiplier: number;
}

export interface SlotMember {
  workHours: WorkHour[];
  startsOnStandardWorkDay: boolean;
}

export interface Slot {
  members: SlotMember[];
}

export type WorkSlots = Slot[];

export interface SlotShift {
  slotIndex: number;
  slot: Slot;
  assigned: SlotWorker[];
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
