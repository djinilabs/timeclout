import { ValidationRule } from "../types";

export const minimumExperiencedWorker: ValidationRule = (
  schedule,
  _,
  minimumExperiencedWorker
) => {
  if (typeof minimumExperiencedWorker !== "number") {
    return true;
  }
  return schedule.shifts.every((shift) =>
    shift.assigned.some(
      (worker) => worker.experience >= minimumExperiencedWorker
    )
  );
};
