import { useMemo } from "react";

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

  const [
    requireMinimumRestSlotsAfterShift,
    setRequireMinimumRestSlotsAfterShift,
  ] = useLocalPreference(
    "team-shifts-calendar-require-minimum-rest-slots-after-shift",
    false
  );

  const [minimumRestSlotsAfterShift, setMinimumRestSlotsAfterShift] =
    useLocalPreference<
      {
        inconvenienceLessOrEqualThan: number;
        minimumRestMinutes: number;
      }[]
    >(
      "team-shifts-calendar-minimum-rest-slots-after-shift",
      useMemo(() => [], [])
    );

  const [
    analyzeWorkerInconvenienceEquality,
    setAnalyzeWorkerInconvenienceEquality,
  ] = useLocalPreference(
    "team-shifts-calendar-analyze-worker-inconvenience-equality",
    false
  );

  const [analyzeWorkerSlotEquality, setAnalyzeWorkerSlotEquality] =
    useLocalPreference(
      "team-shifts-calendar-analyze-worker-slot-equality",
      false
    );

  const [analyzeWorkerSlotProximity, setAnalyzeWorkerSlotProximity] =
    useLocalPreference(
      "team-shifts-calendar-analyze-worker-slot-proximity",
      false
    );

  return {
    analyzeLeaveConflicts: analyze && analyzeLeaveConflicts,
    setAnalyzeLeaveConflicts,
    requireMaximumIntervalBetweenShifts:
      analyze && requireMaximumIntervalBetweenShifts,
    setRequireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShiftsInDays,
    setMaximumIntervalBetweenShiftsInDays,
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday:
      analyze && requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday,
    minimumNumberOfShiftsPerWeekInStandardWorkday,
    setMinimumNumberOfShiftsPerWeekInStandardWorkday,
    requireMinimumRestSlotsAfterShift:
      analyze && requireMinimumRestSlotsAfterShift,
    setRequireMinimumRestSlotsAfterShift,
    minimumRestSlotsAfterShift: analyze ? minimumRestSlotsAfterShift : [],
    setMinimumRestSlotsAfterShift,
    analyzeWorkerInconvenienceEquality:
      analyze && analyzeWorkerInconvenienceEquality,
    setAnalyzeWorkerInconvenienceEquality,
    analyzeWorkerSlotEquality: analyze && analyzeWorkerSlotEquality,
    setAnalyzeWorkerSlotEquality,
    analyzeWorkerSlotProximity: analyze && analyzeWorkerSlotProximity,
    setAnalyzeWorkerSlotProximity,
  };
};
