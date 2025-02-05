import { ShiftScheduleHeuristic } from "../types";
import { getUniqueWorkers } from "../utils/getUniqueWorkers";
import { stdDev } from "../utils/standardDeviation";

export const workerExperienceEqualityHeuristic: ShiftScheduleHeuristic = {
  name: "Worker Experience Equality",
  eval: (schedule) => {
    const workers = Array.from(getUniqueWorkers(schedule));
    const averageWorkerExperience =
      workers.reduce((exp, worker) => exp + worker.experience, 0) /
      workers.length;

    const scores = schedule.shifts.map(
      (shift) =>
        shift.assigned.reduce((exp, worker) => exp + worker.experience, 0) /
        shift.assigned.length /
        averageWorkerExperience
    );

    return stdDev(1, scores);
  },
};
