import { BarDatum, ComputedDatum, ResponsiveBar } from "@nivo/bar";
import { FC, useCallback } from "react";

export interface StackedBarPlotProps {
  data: Record<string, number | string>[];
  groupNames: string[];
  legend: string;
  tickLabel: (data: string) => string;
}

export const StackedBarPlot: FC<StackedBarPlotProps> = ({
  data,
  groupNames,
  legend,
  tickLabel,
}) => {
  return (
    <ResponsiveBar
      data={data}
      keys={groupNames}
      indexBy="workerName"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      borderRadius={4}
      layout="horizontal"
      groupMode="stacked"
      colors={useCallback(
        (bar: ComputedDatum<BarDatum>) => {
          const index = groupNames.indexOf(bar.id as string);
          const hue = 180; // Teal base hue
          const saturation = 50;
          const lightness = 80 - (index * 50) / groupNames.length; // Vary from 80% to 30% lightness
          return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        },
        [groupNames]
      )}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend,
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        renderTick: useCallback(
          (tick: { value: string; x: number; y: number }) => {
            console.log("tick", tick);
            return (
              <g transform={`translate(${tick.x - 25},${tick.y})`}>
                <foreignObject x="-10" y="-10" width="200" height="60">
                  <div className="flex gap-2 flex-col">
                    <span className="text-sm">{tickLabel(tick.value)}</span>
                  </div>
                </foreignObject>
              </g>
            );
          },
          [tickLabel]
        ),
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
  );
};
