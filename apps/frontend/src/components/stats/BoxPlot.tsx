import { FC, memo } from "react";
import { ResponsiveBoxPlot } from "@nivo/boxplot";

export interface BoxPlotProps {
  data: {
    group: string;
    value: number;
  }[];
  tickLabel: (tick: string) => string;
  axisBottomLabel: string;
  axisLeftLabel?: string;
}

export const BoxPlot: FC<BoxPlotProps> = memo(
  ({ data, tickLabel, axisBottomLabel, axisLeftLabel }) => {
    return (
      <ResponsiveBoxPlot
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        minValue="auto"
        maxValue="auto"
        colors="#14b8a6"
        borderRadius={4}
        layout="horizontal"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisBottomLabel,
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisLeftLabel,
          legendPosition: "middle",
          legendOffset: -45,
          renderTick: (tick) => {
            return (
              <g transform={`translate(${tick.x - 25},${tick.y})`}>
                <foreignObject x="-10" y="-10" width="200" height="60">
                  <div className="flex gap-2 flex-col">
                    <span className="text-sm">{tickLabel(tick.value)}</span>
                  </div>
                </foreignObject>
                <text
                  x="-22"
                  y="4"
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{ fill: "rgb(102, 102, 102)", fontSize: "14px" }}
                >
                  {tick.value.name}
                </text>
              </g>
            );
          },
        }}
      />
    );
  }
);
