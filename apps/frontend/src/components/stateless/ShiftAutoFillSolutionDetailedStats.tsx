import { ScoredShiftSchedule } from "@/scheduler";
import { ShiftsAutoFillSolutionInconvenienceDeviationStats } from "./ShiftsAutoFillSolutionInconvenienceDeviationStats";
import { ShiftsAutoFillSolutionScheduleTypeDistributionStats } from "./ShiftsAutoFillSolutionScheduleTypeDistributionStats";
import { ShiftsAutoFillSolutionTimeDistributionStats } from "./ShiftsAutoFillSolutionTimeDistributionStats";
export interface ShiftAutoFillSolutionDetailedStatsProps {
  schedule: ScoredShiftSchedule;
}

export const ShiftAutoFillSolutionDetailedStats = ({
  schedule,
}: ShiftAutoFillSolutionDetailedStatsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <ShiftsAutoFillSolutionInconvenienceDeviationStats schedule={schedule} />
      <ShiftsAutoFillSolutionScheduleTypeDistributionStats
        schedule={schedule}
      />
      <ShiftsAutoFillSolutionTimeDistributionStats schedule={schedule} />
    </div>
  );
};
