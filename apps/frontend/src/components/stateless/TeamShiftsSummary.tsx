import { FC } from "react";

export interface TeamShiftsSummaryProps {
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
}

export const TeamShiftsSummary: FC<TeamShiftsSummaryProps> = () => {
  return <div>TeamShiftsSummary</div>;
};
