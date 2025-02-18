import { ScoredShiftSchedule } from "@/scheduler";
import { ShiftsAutoFillSolutionInconvenienceDeviationStats } from "./ShiftsAutoFillSolutionInconvenienceDeviationStats";

export interface ShiftAutoFillSolutionDetailedStatsProps {
  schedule: ScoredShiftSchedule;
}

export const ShiftAutoFillSolutionDetailedStats = ({
  schedule,
}: ShiftAutoFillSolutionDetailedStatsProps) => {
  return (
    <div className="flex gap-4">
      <ShiftsAutoFillSolutionInconvenienceDeviationStats schedule={schedule} />
    </div>
  );
};
