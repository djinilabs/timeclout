import { memo } from "react";
import { FaSpinner } from "react-icons/fa";

export interface LoadingProps {
  variant?: "spinner" | "skeleton" | "skeleton-card" | "skeleton-list";
  className?: string;
}

export const Loading = memo<LoadingProps>(({ variant = "spinner", className = "" }) => {
  if (variant === "spinner") {
    return (
      <div className={`flex justify-center items-center h-full p-4 ${className}`}>
        <FaSpinner className="animate-spin text-teal-600" aria-label="Loading" />
      </div>
    );
  }

  // For skeleton variants, we'll import and use SkeletonLoader
  // This allows gradual migration
  return (
    <div className={`flex justify-center items-center h-full p-4 ${className}`}>
      <FaSpinner className="animate-spin text-teal-600" aria-label="Loading" />
    </div>
  );
});

Loading.displayName = "Loading";
