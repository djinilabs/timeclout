import { classNames } from "../../utils/classNames";

interface ProgressBarProperties {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  className,
  showPercentage = false,
  label = "Progress",
}: ProgressBarProperties) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={classNames("w-full", className)}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full w-full flex-1 bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-gray-600" aria-hidden="true">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
