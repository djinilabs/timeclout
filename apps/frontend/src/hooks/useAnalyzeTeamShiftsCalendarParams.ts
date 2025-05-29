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

  const [
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday,
  ] = useLocalPreference(
    "team-shifts-calendar-require-minimum-number-of-shifts-per-week-in-standard-workday",
    false
  );

  const [
    minimumNumberOfShiftsPerWeekInStandardWorkday,
    setMinimumNumberOfShiftsPerWeekInStandardWorkday,
  ] = useLocalPreference(
    "team-shifts-calendar-minimum-number-of-shifts-per-week-in-standard-workday",
    1
  );

  return {
    analyzeLeaveConflicts: analyze && analyzeLeaveConflicts,
    setAnalyzeLeaveConflicts,
    requireMaximumIntervalBetweenShifts:
      analyze && requireMaximumIntervalBetweenShifts,
    setRequireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShiftsInDays,
    setMaximumIntervalBetweenShiftsInDays,
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    minimumNumberOfShiftsPerWeekInStandardWorkday,
    setMinimumNumberOfShiftsPerWeekInStandardWorkday,
  };
};
