import { type ScoredShiftSchedule } from "@/scheduler";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import { Avatar } from "./Avatar";

export const ShiftsAutoFillSolutionScheduleTypeDistributionStats = ({
  schedule,
}: {
  schedule: ScoredShiftSchedule;
}) => {
  const { schedule: shiftSchedule } = schedule;
  // Get unique type names from shifts
  const typeNames = [
    ...new Set(shiftSchedule.shifts.map((shift) => shift.slot.typeName)),
  ];

  // Count assignments per worker per type
  const workerTypeAssignments = shiftSchedule.shifts.reduce(
    (acc, shift) => {
      if (!shift.assigned) return acc;

      if (!acc[shift.assigned.pk]) {
        acc[shift.assigned.pk] = {
          workerName: shift.assigned.pk,
          ...typeNames.reduce(
            (types, type) => ({ ...types, [type]: 0 }),
            {} as Record<string, number>
          ),
        };
      }

      (acc[shift.assigned.pk] as Record<string, number>)[shift.slot.typeName]++;
      return acc;
    },
    {} as Record<string, unknown>
  );

  console.log({ workerTypeAssignments });

  const workerStats = Object.values(workerTypeAssignments);

  // Collect worker info by id
  const workerById = shiftSchedule.shifts.reduce(
    (acc, shift) => {
      if (shift.assigned) {
        acc[shift.assigned.pk] = shift.assigned;
      }
      return acc;
    },
    {} as Record<string, (typeof shiftSchedule.shifts)[number]["assigned"]>
  );

  console.log({ workerStats });

  return (
    <div className="w-full aspect-[2/1]">
      <ResponsiveBar
        data={workerStats as BarDatum[]}
        keys={typeNames}
        indexBy="workerName"
        margin={{ top: 50, right: 130, bottom: 120, left: 60 }}
        layout="vertical"
        groupMode="stacked"
        colors={(bar) => {
          const index = typeNames.indexOf(bar.id as string);
          const hue = 180; // Teal base hue
          const saturation = 50;
          const lightness = 80 - (index * 50) / typeNames.length; // Vary from 80% to 30% lightness
          return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Number of shifts",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Worker",
          legendPosition: "middle",
          legendOffset: 80,
          renderTick: (tick) => {
            const worker = workerById[tick.value];
            return (
              <g transform={`translate(${tick.x},${tick.y + 20})`}>
                <foreignObject x="-24" y="-12" width="80" height="60">
                  <div className="flex gap-2 flex-col items-center">
                    <Avatar {...worker} size={24} />
                    <span className="text-tiny text-nowrap">{worker.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          },
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
          },
        ]}
      />
    </div>
  );
};
