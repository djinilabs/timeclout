import { useLocalPreference } from "./useLocalPreference";

export const useAnalyzeTeamShiftsCalendarParams = (analyze: boolean) => {
  const [analyzeLeaveConflicts, setAnalyzeLeaveConflicts] = useLocalPreference(
    "team-shifts-calendar-show-analyze-leave-conflicts",
    analyze
  );

  const [
    requireMaximumIntervalBetweenShifts,
    setRequireMaximumIntervalBetweenShifts,
  ] = useLocalPreference(
    "team-shifts-calendar-require-maximum-interval-between-shifts",
    false
  );

  const [
    maximumIntervalBetweenShiftsInDays,
    setMaximumIntervalBetweenShiftsInDays,
  ] = useLocalPreference(
    "team-shifts-calendar-maximum-interval-between-shifts",
    10
  );

  return {
    analyzeLeaveConflicts: analyze && analyzeLeaveConflicts,
    setAnalyzeLeaveConflicts,
    requireMaximumIntervalBetweenShifts:
      analyze && requireMaximumIntervalBetweenShifts,
    setRequireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShiftsInDays,
    setMaximumIntervalBetweenShiftsInDays,
  };
};
