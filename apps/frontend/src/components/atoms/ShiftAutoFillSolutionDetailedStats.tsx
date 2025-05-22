import { ScoredShiftSchedule } from "@/scheduler";
import { ShiftsAutoFillSolutionInconvenienceDeviationStats } from "../particles/ShiftsAutoFillSolutionInconvenienceDeviationStats";
import { ShiftsAutoFillSolutionScheduleTypeDistributionStats } from "../particles/ShiftsAutoFillSolutionScheduleTypeDistributionStats";
import { ShiftsAutoFillSolutionTimeDistributionStats } from "../particles/ShiftsAutoFillSolutionTimeDistributionStats";
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
