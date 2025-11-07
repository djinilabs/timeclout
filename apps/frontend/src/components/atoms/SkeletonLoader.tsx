import { FC } from "react";

export interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave";
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  className = "",
  lines = 1,
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses =
    animation === "pulse" ? "bg-gray-200 animate-pulse" : "bg-gray-200";
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-md",
  };

  if (variant === "circular" || variant === "rectangular" || variant === "rounded") {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height) style.height = typeof height === "number" ? `${height}px` : height;

    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        aria-label="Loading"
        role="status"
        aria-live="polite"
      />
    );
  }

  // Text variant with multiple lines
  return (
    <div className={className} aria-label="Loading" role="status" aria-live="polite">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantClasses.text} mb-2 ${
            index === lines - 1 ? "w-3/4" : "w-full"
          }`}
          style={{
            height: height ? (typeof height === "number" ? `${height}px` : height) : "1rem",
            ...(width && index === lines - 1
              ? { width: typeof width === "number" ? `${width}%` : width }
              : {}),
          }}
        />
      ))}
    </div>
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonCard: FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
  >
    <SkeletonLoader variant="rounded" height={24} width="60%" className="mb-4" />
    <SkeletonLoader lines={3} className="mb-4" />
    <SkeletonLoader variant="rounded" height={36} width="120px" />
  </div>
);

export const SkeletonList: FC<{ items?: number; className?: string }> = ({
  items = 3,
  className = "",
}) => (
  <div className={className}>
    {Array.from({ length: items }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-4 border-b border-gray-200 py-4"
      >
        <SkeletonLoader variant="circular" width={40} height={40} />
        <div className="flex-1">
          <SkeletonLoader variant="rounded" height={16} width="40%" className="mb-2" />
          <SkeletonLoader variant="rounded" height={14} width="60%" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTable: FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={`overflow-hidden ${className}`}>
    <div className="grid gap-4 border-b border-gray-200 pb-4 mb-4">
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader
          key={index}
          variant="rounded"
          height={20}
          width={index === 0 ? "30%" : "20%"}
        />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="grid gap-4 border-b border-gray-100 py-3"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader
            key={colIndex}
            variant="rounded"
            height={16}
            width={colIndex === 0 ? "80%" : "60%"}
          />
        ))}
      </div>
    ))}
  </div>
);

