import { Trans } from "@lingui/react/macro";
import { ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { Attention } from "../particles/Attention";
import { ColorLabel } from "../particles/ColorLabel";
import { VerticalTabs } from "../particles/VerticalTabs";

import { ShiftsAutoFillSolution } from "./ShiftsAutoFillSolution";

import { DayDate } from "@/day-date";
import { SchedulerState } from "@/scheduler";
import { getDefined } from "@/utils";

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
                <Trans>conflict(s) when trying to search for a solution</Trans>{" "}
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
      <div>
        <div className="flex flex-row justify-between border-b border-gray-400 py-2 rounded-tl-md">
          <span>
            <Trans>Solutions</Trans>
          </span>
        </div>
        <VerticalTabs
          tabs={progress.topSolutions.map((solution, rank) => ({
            id: solution.id,
            label: (
              <ColorLabel
                randomString={solution.id}
                label={<span className="text-sm">{`#${rank + 1}`}</span>}
              />
            ),
            content: (
              <ShiftsAutoFillSolution
                team={getDefined(team)}
                company={getDefined(company)}
                startDate={startDate}
                endDate={endDate}
                progress={progress}
                solution={solution}
                shiftPositions={shiftPositions}
                canAssignShiftPositions={canAssignShiftPositions}
                onAssignShiftPositions={onAssignShiftPositions}
              />
            ),
          }))}
        />
      </div>
    </div>
  );
};
