import { ResponsiveBar, BarDatum, ComputedDatum } from "@nivo/bar";
import { FC, memo, useCallback } from "react";

export interface DeviationBarPlotDatum extends BarDatum {
  group: string;
  deviation: number;
}

export interface DeviationBarPlotProperties {
  data: DeviationBarPlotDatum[];
  maxDeviation: number;
  label: (data: DeviationBarPlotDatum) => string;
  color: (data: DeviationBarPlotDatum) => string;
  tickLabel: (data: string) => string;
  axisBottomLabel: string;
  ariaLabel: string;
}

export const DeviationBarPlot: FC<DeviationBarPlotProperties> = memo(
  function DeviationBarPlot({
    data,
    label,
    tickLabel,
    maxDeviation,
    color,
    axisBottomLabel,
    ariaLabel,
  }) {
    return (
      <ResponsiveBar
        labelTextColor="black"
        label={useCallback(
          (datum: ComputedDatum<DeviationBarPlotDatum>) => label(datum.data),
          [label]
        )}
        minValue={-maxDeviation}
        maxValue={maxDeviation}
        data={data}
        keys={["deviation"]}
        indexBy="group"
        layout="horizontal"
        margin={{ top: 50, right: 50, bottom: 50, left: 80 }}
        colors={useCallback(
          (datum: ComputedDatum<DeviationBarPlotDatum>) => color(datum.data),
          [color]
        )}
        borderRadius={4}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          renderTick: (tick) => {
            return (
              <g transform={`translate(${tick.x - 20},${tick.y})`}>
                <foreignObject x="-48" y="-12" width="200" height="60">
                  <div className="flex gap-2 flex-col">
                    <span className="text-sm">{tickLabel(tick.value)}</span>
                  </div>
                </foreignObject>
                <text
                  x="-52"
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
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisBottomLabel,
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
        ariaLabel={ariaLabel}
      />
    );
  }
);
