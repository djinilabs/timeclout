import { FC, memo } from "react";

export interface PercentageStatCardProperties {
  name: string;
  value: number;
}

export const PercentageStatCard: FC<PercentageStatCardProperties> = memo(
  ({ name, value }) => {
    return (
      <div
        key={name}
        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
      >
        <dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
        <dd className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, value).toLocaleString()}%`,
                backgroundColor: `hsl(${value * 1.2}, 70%, ${
                  value < 50 ? 60 : 65
                }%)`,
              }}
            />
          </div>
          <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
            {value}%
          </div>
        </dd>
      </div>
    );
  }
);

PercentageStatCard.displayName = "PercentageStatCard";
