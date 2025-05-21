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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
      <ShiftsAutoFillSolutionInconvenienceDeviationStats schedule={schedule} />
      <ShiftsAutoFillSolutionScheduleTypeDistributionStats
        schedule={schedule}
      />
      <ShiftsAutoFillSolutionTimeDistributionStats schedule={schedule} />
    </div>
  );
};
