import { DayDate } from "@/day-date";
import { ShiftPosition } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";
import { useMemo } from "react";

export interface UseTeamShiftsQueryResult {
  data: ShiftPosition[];
  error?: Error;
  fetching: boolean;
}

export const useTeamShiftsQuery = (
  team: string,
  selectedDate: DayDate
): UseTeamShiftsQueryResult => {
  const [shiftPositionsResult] = useQuery<{
    shiftPositions: ShiftPosition[];
  }>({
    query: shiftPositionsQuery,
    pollingIntervalMs: 30000,
    variables: {
      team,
      startDay: selectedDate.fullMonthBackFill().toString(),
      endDay: selectedDate.fullMonthForwardFill().toString(),
    },
  });

  return {
    data: useMemo(
      () => shiftPositionsResult.data?.shiftPositions ?? [],
      [shiftPositionsResult.data?.shiftPositions]
    ),
    error: shiftPositionsResult.error,
    fetching: shiftPositionsResult.fetching,
  };
};
