import { useMemo } from "react";
import { type SchedulerState } from "@/scheduler";
import { PercentageStatCard } from "./PercentageStatCard";

export interface ShiftAutoFillSolutionDetailedStatsProps {
  progress: SchedulerState;
}

export const ShiftAutoFillSolutionDetailedStats = ({
  progress,
}: ShiftAutoFillSolutionDetailedStatsProps) => {
  const topSolution = progress.topSolutions[0];

  const stats = useMemo(() => {
    return [
      { name: "Cycle count", stat: progress.cycleCount.toLocaleString() },
      { name: "Computed shifts", stat: progress.computed.toLocaleString() },
      {
        name: "Top score",
        stat: (
          <PercentageStatCard
            key="top-score"
            name="Top score"
            value={Math.round((1 - (topSolution?.score ?? 0)) * 100)}
          />
        ),
      },
    ];
  }, [progress, topSolution]);

  const discardedStats = useMemo(() => {
    const total = Array.from(progress.discardedReasons.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    return Array.from(progress.discardedReasons.entries()).map(
      ([reason, count]) => ({
        name: reason,
        stat: `${count.toLocaleString()} (${Math.round(
          (count / total) * 100
        )}%)`,
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
    <div className="mt-5">
      <h3 className="text-base font-semibold text-gray-900">
        Auto-fill progress
      </h3>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5">
          {stats.map((item) =>
            typeof item.stat === "string" ? (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
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
            Discarded Schedules
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            {discardedStats.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
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
      <div className="mt-5"></div>
      <h3 className="text-base font-semibold text-gray-900">Top Solution</h3>
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
  );
};
