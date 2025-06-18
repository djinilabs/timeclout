import { DayDate } from "@/day-date";
import { ShiftPosition } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";
import { useMemo } from "react";

export interface UseTeamShiftsQueryResult {
  data: ShiftPosition[];
  error?: Error;
  fetching: boolean;
  refetch: () => void;
}

export interface UseTeamShiftsQueryOptions {
  team: string;
  startDay?: DayDate;
  endDay?: DayDate;
  pollingIntervalMs?: number;
  pause?: boolean;
}

export const useTeamShiftsQuery = ({
  team,
  startDay,
  endDay,
  pollingIntervalMs,
  pause,
}: UseTeamShiftsQueryOptions): UseTeamShiftsQueryResult => {
  const [shiftPositionsResult, refetch] = useQuery<{
    shiftPositions: ShiftPosition[];
  }>({
    query: shiftPositionsQuery,
    pollingIntervalMs,
    variables: {
      team,
      startDay: startDay?.toString() ?? "",
      endDay: endDay?.toString() ?? "",
      version: "staging",
    },
    pause: pause || !startDay || !endDay,
  });

  return {
    data: useMemo(
      () => shiftPositionsResult.data?.shiftPositions ?? [],
      [shiftPositionsResult.data?.shiftPositions]
    ),
    error: shiftPositionsResult.error,
    fetching: shiftPositionsResult.fetching,
    refetch,
  };
};
