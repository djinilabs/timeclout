import { useMemo } from "react";
import { Trans } from "@lingui/react/macro";
import { type SchedulerState } from "@/scheduler";
import { PercentageStatCard } from "./PercentageStatCard";
import { i18n } from "@lingui/core";

export interface ShiftAutoFillSolutionStatsProps {
  progress: SchedulerState;
}

export const ShiftAutoFillSolutionStats = ({
  progress,
}: ShiftAutoFillSolutionStatsProps) => {
  const topSolution = progress.topSolutions[0];

  const stats = useMemo(() => {
    return [
      ...(topSolution
        ? [
            {
              name: i18n.t("Score"),
              stat: (
                <PercentageStatCard
                  key="top-score"
                  name="Top score"
                  value={Math.round((1 - (topSolution?.score ?? 0)) * 100)}
                />
              ),
            },
          ]
        : []),
    ];
  }, [topSolution]);

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

  const topSolutionStats = useMemo(() => {
    return topSolution?.heuristicScores.map((heuristic) => ({
      name: heuristic.name,
      stat: Math.round((1 - heuristic.score) * 100),
    }));
  }, [topSolution]);

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
      {topSolutionStats?.length > 0 && (
        <div className="mt-5">
          <h3 className="text-base font-semibold text-gray-900">
            <Trans>Top Solution</Trans>
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            {topSolutionStats?.map((item) => (
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
