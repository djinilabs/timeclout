import { useMemo } from "react";
import { Slot, SlotWorker, type ScoredShiftSchedule } from "@/scheduler";
import { ResponsiveBar } from "@nivo/bar";
import { Avatar } from "./Avatar";

export interface ShiftAutoFillSolutionDetailedStatsProps {
  schedule: ScoredShiftSchedule;
}

export const ShiftAutoFillSolutionDetailedStats = ({
  schedule,
}: ShiftAutoFillSolutionDetailedStatsProps) => {
  const { schedule: shiftSchedule } = schedule;

  const { workerById, inconvenienceByWorker, expectedInconvenience } =
    useMemo(() => {
      // Group shifts by worker
      const workerShifts = shiftSchedule.shifts.reduce(
        (acc, shift) => {
          const workerPk = shift.assigned.pk;
          if (!acc[workerPk]) {
            acc[workerPk] = [];
          }
          acc[workerPk].push(shift.slot);
          return acc;
        },
        {} as Record<string, Slot[]>
      );

      // calculate expected inconvenience
      // Calculate total inconvenience across all slots
      const totalInconvenience = Object.values(workerShifts).reduce(
        (acc, slots) =>
          acc +
          slots.reduce(
            (slotAcc, slot) =>
              slotAcc +
              slot.workHours.reduce(
                (hourAcc, workHour) =>
                  hourAcc +
                  (workHour.end - workHour.start) *
                    workHour.inconvenienceMultiplier,
                0
              ),
            0
          ),
        0
      );

      // Calculate expected inconvenience per worker
      const expectedInconvenience =
        totalInconvenience / Object.keys(workerShifts).length;

      // Calculate total inconvenience per worker
      const inconvenienceByWorker = Object.entries(workerShifts).map(
        ([workerPk, slots]) => ({
          workerPk,
          totalInconvenience: slots.reduce(
            (acc, slot) =>
              acc +
              slot.workHours.reduce(
                (sum, workHour) =>
                  sum +
                  (workHour.end - workHour.start) *
                    workHour.inconvenienceMultiplier,
                0
              ),
            0
          ),
          numShifts: slots.length,
        })
      );

      // Collect worker info by id
      const workerById = shiftSchedule.shifts.reduce(
        (acc, shift) => {
          acc[shift.assigned.pk] = shift.assigned;
          return acc;
        },
        {} as Record<string, SlotWorker>
      );

      return {
        expectedInconvenience,
        inconvenienceByWorker,
        workerById,
      };
    }, [shiftSchedule]);

  const maxDeviation = Math.max(
    ...inconvenienceByWorker.map((w) =>
      Math.abs(w.totalInconvenience - expectedInconvenience)
    )
  );

  return (
    <div className="flex gap-4">
      <div
        className="w-full"
        style={{ height: `${inconvenienceByWorker.length * 100}px` }}
      >
        <ResponsiveBar
          labelTextColor="black"
          label={({ data }) => {
            const deviationPercent = (
              (data.deviation / expectedInconvenience) *
              100
            ).toFixed(1);
            return `${data.deviation >= 0 ? "+" : ""}${deviationPercent}%`;
          }}
          minValue={-maxDeviation}
          maxValue={maxDeviation}
          data={inconvenienceByWorker.map((worker) => ({
            worker: worker.workerPk,
            deviation: worker.totalInconvenience - expectedInconvenience,
          }))}
          keys={["deviation"]}
          indexBy="worker"
          layout="horizontal"
          margin={{ top: 50, right: 50, bottom: 50, left: 120 }}
          colors={({ data }) => {
            const deviation = Math.abs(data.deviation);

            const ratio = deviation / maxDeviation;
            // Use teal color scale from light to dark based on ratio
            const tealBase = 180; // Teal hue
            const lightness = 80 - ratio * 40; // Vary from 80% to 30% lightness
            return `hsl(${tealBase}, 50%, ${lightness}%)`;
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Worker",
            legendPosition: "middle",
            legendOffset: -100,
            renderTick: (tick) => {
              const worker = workerById[tick.value];
              return (
                <g transform={`translate(${tick.x - 20},${tick.y})`}>
                  <foreignObject x="-48" y="-12" width="200" height="60">
                    <div className="flex gap-2 flex-col">
                      <Avatar {...worker} size={24} />
                      <span className="text-tiny">{worker.name}</span>
                    </div>
                  </foreignObject>
                  <text
                    x="-52"
                    y="4"
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ fill: "rgb(102, 102, 102)", fontSize: "12px" }}
                  >
                    {tick.value.name}
                  </text>
                </g>
              );
            },
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Inconvenience:Deviation from Expected",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          markers={[
            {
              axis: "x",
              value: 0,
              lineStyle: { stroke: "#b0b0b0", strokeWidth: 1 },
              legend: "",
              legendPosition: "top",
            },
          ]}
          labelSkipWidth={12}
          labelSkipHeight={12}
          role="application"
          ariaLabel="Worker inconvenience deviation chart"
        />
      </div>
    </div>
  );
};
