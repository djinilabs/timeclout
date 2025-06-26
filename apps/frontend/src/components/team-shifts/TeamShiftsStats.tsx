import { FC, memo } from "react";
import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { TeamShiftsInconvenienceDeviationStats } from "../particles/TeamShiftsInconvenienceDeviationStats";
import { TeamShiftsScheduleTypeDistributionStats } from "../particles/TeamShiftsScheduleTypeDistributionStats";
import { TeamShiftsTimeDistributionStats } from "../particles/TeamShiftsTimeDistributionStats";

export interface TeamShiftsStatsProps {
  year: number;
  month: number;
  goTo?: (year: number, month: number) => void;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
}

export const TeamShiftsStats: FC<TeamShiftsStatsProps> = memo(
  ({ shiftPositionsMap }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        <TeamShiftsInconvenienceDeviationStats
          shiftPositionsMap={shiftPositionsMap}
        />
        <TeamShiftsScheduleTypeDistributionStats
          shiftPositionsMap={shiftPositionsMap}
        />
        <TeamShiftsTimeDistributionStats
          shiftPositionsMap={shiftPositionsMap}
        />
      </div>
    );
  }
);
