import { type FC, memo } from "react";

import { ShiftsAutoFillSolutionInconvenienceDeviationStats } from "../particles/ShiftsAutoFillSolutionInconvenienceDeviationStats";
import { ShiftsAutoFillSolutionScheduleTypeDistributionStats } from "../particles/ShiftsAutoFillSolutionScheduleTypeDistributionStats";
import { ShiftsAutoFillSolutionTimeDistributionStats } from "../particles/ShiftsAutoFillSolutionTimeDistributionStats";

import { type ScoredShiftSchedule } from "@/scheduler";

export interface ShiftAutoFillSolutionDetailedStatsProperties {
  schedule: ScoredShiftSchedule;
}

export const ShiftAutoFillSolutionDetailedStats: FC<ShiftAutoFillSolutionDetailedStatsProperties> =
  memo(({ schedule }: ShiftAutoFillSolutionDetailedStatsProperties) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        <ShiftsAutoFillSolutionInconvenienceDeviationStats
          schedule={schedule}
        />
        <ShiftsAutoFillSolutionScheduleTypeDistributionStats
          schedule={schedule}
        />
        <ShiftsAutoFillSolutionTimeDistributionStats schedule={schedule} />
      </div>
    );
  });

ShiftAutoFillSolutionDetailedStats.displayName =
  "ShiftAutoFillSolutionDetailedStats";
