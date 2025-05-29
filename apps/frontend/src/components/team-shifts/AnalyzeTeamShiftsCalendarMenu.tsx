import { Trans } from "@lingui/react/macro";
import { LabeledSwitch } from "../particles/LabeledSwitch";

export interface AnalyzeTeamShiftsCalendarMenuProps {
  analyzeLeaveConflicts: boolean;
  setAnalyzeLeaveConflicts: (analyzeLeaveConflicts: boolean) => void;
  requireMaximumIntervalBetweenShifts: boolean;
  setRequireMaximumIntervalBetweenShifts: (
    requireMaximumIntervalBetweenShifts: boolean
  ) => void;
  maximumIntervalBetweenShiftsInDays: number;
  setMaximumIntervalBetweenShiftsInDays: (
    maximumIntervalBetweenShiftsInDays: number
  ) => void;
}

export const AnalyzeTeamShiftsCalendarMenu = ({
  analyzeLeaveConflicts,
  setAnalyzeLeaveConflicts,
  requireMaximumIntervalBetweenShifts,
  setRequireMaximumIntervalBetweenShifts,
  maximumIntervalBetweenShiftsInDays,
  setMaximumIntervalBetweenShiftsInDays,
}: AnalyzeTeamShiftsCalendarMenuProps) => {
  return (
    <div className="flex flex-col gap-2">
      <LabeledSwitch
        label={<Trans>Show leave conflicts</Trans>}
        checked={analyzeLeaveConflicts}
        onChange={setAnalyzeLeaveConflicts}
      />
      <div className="flex items-center">
        <LabeledSwitch
          label={
            <Trans>
              Require a maximum interval between shifts for each worker (in
              days)
            </Trans>
          }
          checked={requireMaximumIntervalBetweenShifts}
          onChange={setRequireMaximumIntervalBetweenShifts}
        />
        {requireMaximumIntervalBetweenShifts && (
          <input
            type="number"
            value={maximumIntervalBetweenShiftsInDays}
            min={1}
            className="w-16 text-center"
            disabled={!requireMaximumIntervalBetweenShifts}
            onChange={(e) =>
              setMaximumIntervalBetweenShiftsInDays(parseInt(e.target.value))
            }
          />
        )}
      </div>
    </div>
  );
};
