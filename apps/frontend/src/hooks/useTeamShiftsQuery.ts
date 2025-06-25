import { DayDate } from "@/day-date";
import { ShiftPosition, User } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";
import { useMemo } from "react";

export interface UseTeamShiftsQueryResult {
  data?: {
    shiftPositions: ShiftPosition[];
    areAnyUnpublished: boolean;
  };
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
  restrictToUsers?: User[];
}

export const useTeamShiftsQuery = ({
  team,
  startDay,
  endDay,
  pollingIntervalMs,
  pause,
  restrictToUsers,
}: UseTeamShiftsQueryOptions): UseTeamShiftsQueryResult => {
  const [shiftPositionsResult, refetch] = useQuery<{
    shiftPositions?: {
      shiftPositions: ShiftPosition[];
      areAnyUnpublished: boolean;
    };
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

  const filteredShiftPositions = useMemo(() => {
    if (!restrictToUsers || !shiftPositionsResult.data?.shiftPositions) {
      return shiftPositionsResult.data?.shiftPositions;
    }
    return {
      shiftPositions:
        shiftPositionsResult.data.shiftPositions.shiftPositions.filter(
          (shiftPosition) =>
            restrictToUsers.some(
              (user) => user.pk === shiftPosition.assignedTo?.pk
            )
        ),
      areAnyUnpublished:
        shiftPositionsResult.data.shiftPositions.areAnyUnpublished,
    };
  }, [shiftPositionsResult.data?.shiftPositions, restrictToUsers]);

  return {
    data: filteredShiftPositions,
    error: shiftPositionsResult.error,
    fetching: shiftPositionsResult.fetching,
    refetch,
  };
};
