import { Trans } from "@lingui/react/macro";
import { LabeledSwitch } from "../particles/LabeledSwitch";

export interface AnalyzeTeamShiftsCalendarMenuProps {
  analyzeInconvenienceLoad: boolean;
  setAnalyzeInconvenienceLoad: (analyzeInconvenienceLoad: boolean) => void;
}

export const AnalyzeTeamShiftsCalendarMenu = ({
  analyzeInconvenienceLoad,
  setAnalyzeInconvenienceLoad,
}: AnalyzeTeamShiftsCalendarMenuProps) => {
  return (
    <div>
      <LabeledSwitch
        label={<Trans>Analyze inconvenience load</Trans>}
        checked={analyzeInconvenienceLoad}
        onChange={setAnalyzeInconvenienceLoad}
      />
    </div>
  );
};
