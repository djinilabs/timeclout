import { Trans } from "@lingui/react/macro";
import { LabeledSwitch } from "../particles/LabeledSwitch";

export interface AnalyzeTeamShiftsCalendarMenuProps {
  analyzeLeaveConflicts: boolean;
  setAnalyzeLeaveConflicts: (analyzeLeaveConflicts: boolean) => void;
}

export const AnalyzeTeamShiftsCalendarMenu = ({
  analyzeLeaveConflicts,
  setAnalyzeLeaveConflicts,
}: AnalyzeTeamShiftsCalendarMenuProps) => {
  return (
    <div>
      <LabeledSwitch
        label={<Trans>Show leave conflicts</Trans>}
        checked={analyzeLeaveConflicts}
        onChange={setAnalyzeLeaveConflicts}
      />
    </div>
  );
};
