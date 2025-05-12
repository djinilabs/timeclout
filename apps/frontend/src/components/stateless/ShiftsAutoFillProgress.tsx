import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { SchedulerState } from "@/scheduler";
import { DayDate } from "@/day-date";
import { ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { getDefined } from "@/utils";
import { Attention } from "./Attention";
import { ShiftsAutoFillSolution } from "./ShiftsAutoFillSolution";

export interface ShiftsAutoFillProgressProps {
  startDate?: DayDate;
  endDate?: DayDate;
  progress: SchedulerState;
  shiftPositions: ShiftPositionType[];
  canAssignShiftPositions: boolean;
  onAssignShiftPositions: () => void;
}

export const ShiftsAutoFillProgress = ({
  startDate,
  endDate,
  progress,
  shiftPositions,
  canAssignShiftPositions,
  onAssignShiftPositions,
}: ShiftsAutoFillProgressProps) => {
  const { team, company } = useParams();
  const topSolution = progress.topSolutions[0];

  // problematic slots
  const { computed, problemInSlotIds, discardedReasons } = progress;

  const totalDiscarded = useMemo(() => {
    return Array.from(discardedReasons.values()).reduce(
      (acc, count) => acc + count,
      0
    );
  }, [discardedReasons]);

  const problemInShiftPosition = useMemo(() => {
    if (computed > totalDiscarded) {
      return undefined;
    }
    const mostProblematicShiftPositionId = Array.from(problemInSlotIds).reduce<
      [number, string]
    >(
      ([maxCount, maxId], [id, count]) => {
        if (count > maxCount) {
          return [count, id];
        }
        return [maxCount, maxId];
      },
      [0, ""]
    )?.[1];
    return shiftPositions.find(
      (shiftPosition) => shiftPosition.sk === mostProblematicShiftPositionId
    );
  }, [computed, problemInSlotIds, shiftPositions, totalDiscarded]);

  const problemInShiftPositionDay = useMemo(() => {
    return problemInShiftPosition?.day
      ? new DayDate(problemInShiftPosition?.day).toHumanString()
      : undefined;
  }, [problemInShiftPosition]);

  const discardedReasonsList = useMemo(() => {
    return Array.from(discardedReasons.entries()).map(([reason, count]) => ({
      reason,
      count,
    }));
  }, [discardedReasons]);

  return (
    <div>
      {discardedReasonsList.length > 0 && (
        <div className="mt-5">
          <Attention title={<Trans>Attention needed</Trans>}>
            <>
              <p>
                <Trans>There are</Trans>{" "}
                {problemInSlotIds.size + discardedReasonsList.length}{" "}
                <Trans>conflict(s) when trying to search for a solution</Trans>
                {problemInShiftPositionDay ? (
                  <>
                    <Trans>starting on day</Trans> {problemInShiftPositionDay}
                  </>
                ) : (
                  ""
                )}
                .
              </p>
              <p>
                <Trans>
                  Some solutions have been discarded because of the following
                  reasons:
                </Trans>
                <ul className="list-disc list-inside">
                  {discardedReasonsList.map(({ reason }) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </p>
            </>
          </Attention>
        </div>
      )}
      <ShiftsAutoFillSolution
        team={getDefined(team)}
        company={getDefined(company)}
        startDate={startDate}
        endDate={endDate}
        progress={progress}
        solution={topSolution}
        shiftPositions={shiftPositions}
        canAssignShiftPositions={canAssignShiftPositions}
        onAssignShiftPositions={onAssignShiftPositions}
      />
    </div>
  );
};
