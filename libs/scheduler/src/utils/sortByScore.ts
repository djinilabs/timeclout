import { ScoredShiftSchedule } from "../types";

export const sortByScore = (a: ScoredShiftSchedule, b: ScoredShiftSchedule) =>
  a.score - b.score;
