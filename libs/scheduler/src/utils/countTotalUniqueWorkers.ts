import { ShiftSchedule } from "../types";
import { getUniqueWorkers } from "./getUniqueWorkers";

export const countTotalUniqueWorkers = (schedule: ShiftSchedule): number =>
  getUniqueWorkers(schedule).size;
