import { useMemo } from "react";
import { Trans } from "@lingui/react/macro";
import { ScoredShiftSchedule, type SchedulerState } from "@/scheduler";
import { PercentageStatCard } from "../atoms/PercentageStatCard";
import { i18n } from "@lingui/core";

export interface ShiftAutoFillSolutionStatsProps {
  solution: ScoredShiftSchedule;
  progress: SchedulerState;
}

export const ShiftAutoFillSolutionStats = ({
  solution,
  progress,
}: ShiftAutoFillSolutionStatsProps) => {
  const stats = useMemo(() => {
    return [
      ...(solution
        ? [
            {
              name: i18n.t("Top Score"),
              stat: (
                <PercentageStatCard
                  key="top-score"
                  name={i18n.t("Top score")}
                  value={Math.round(
                    (1 - (progress.topSolutions[0]?.score ?? 0)) * 100
                  )}
                />
              ),
            },
            {
              name: i18n.t("This solution score"),
              stat: (
                <PercentageStatCard
                  key="this-score"
                  name={i18n.t("This solution score")}
                  value={Math.round((1 - (solution?.score ?? 0)) * 100)}
                />
              ),
            },
          ]
        : []),
    ];
  }, [progress.topSolutions, solution]);

  const discardedStats = useMemo(() => {
    const total = Array.from(progress.discardedReasons.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    return Array.from(progress.discardedReasons.entries()).map(
      ([reason, count]) => ({
        name: reason,
        stat: `${Math.round((count / total) * 100).toLocaleString()}%`,
      })
    );
  }, [progress.discardedReasons]);

  const solutionStats = useMemo(() => {
    return solution?.heuristicScores.map((heuristic) => ({
      name: heuristic.name,
      stat: Math.round((1 - heuristic.score) * 100),
    }));
  }, [solution]);

  return (
    <div>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5">
          {stats.map((item) =>
            typeof item.stat === "string" ? (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ) : (
              item.stat
            )
          )}
        </dl>
      </div>
      {discardedStats.length > 0 && (
        <div className="mt-5">
          <h3 className="text-base font-semibold text-gray-900">
            <Trans>Discarded Schedules</Trans>
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            {discardedStats.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {solutionStats?.length > 0 && (
        <div className="mt-5">
          <h3 className="text-base font-semibold text-gray-900">
            <Trans>Solution Heuristic Scores</Trans>
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            {solutionStats?.map((item) => (
              <PercentageStatCard
                key={item.name}
                name={item.name}
                value={item.stat}
              />
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};
