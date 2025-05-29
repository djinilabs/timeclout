import { useLocalPreference } from "./useLocalPreference";

export const useAnalyzeTeamShiftsCalendarParams = (analyze: boolean) => {
  const [analyzeLeaveConflicts, setAnalyzeLeaveConflicts] = useLocalPreference(
    "team-shifts-calendar-show-analyze-leave-conflicts",
    analyze
  );

  return {
    analyzeLeaveConflicts: analyze && analyzeLeaveConflicts,
    setAnalyzeLeaveConflicts,
  };
};
