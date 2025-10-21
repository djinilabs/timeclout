import { useMemo } from "react";

import { ShiftPosition, User } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

import { DayDate } from "@/day-date";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";

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
  const [{ data, error, fetching }, refetch] = useQuery<{
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
    if (!restrictToUsers || !data?.shiftPositions) {
      return data?.shiftPositions;
    }
    return {
      shiftPositions: data.shiftPositions.shiftPositions.filter(
        (shiftPosition) =>
          restrictToUsers.some(
            (user) => user.pk === shiftPosition.assignedTo?.pk
          )
      ),
      areAnyUnpublished: data.shiftPositions.areAnyUnpublished,
    };
  }, [data, restrictToUsers]);

  return {
    data: filteredShiftPositions,
    error,
    fetching,
    refetch,
  };
};
