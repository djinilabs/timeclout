import { FC, PropsWithChildren, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  onClick?: () => void;
  to?: string;
  cancel?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  "aria-label"?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const CancelButton: FC<PropsWithChildren<ButtonProps>> = memo(
  function CancelButton({
    onClick,
    children,
    "aria-label": ariaLabel,
    disabled,
    size = "md",
  }) {
    // For cancel buttons, we want to be explicit about the action
    const label =
      ariaLabel ||
      (typeof children === "string" ? `${children} action` : "Cancel action");

    const sizeClasses = {
      sm: "text-xs/5",
      md: "text-sm/6",
      lg: "text-base/7",
    };

    return (
      <button
        onClick={onClick}
        type="button"
        className={`${sizeClasses[size]} font-semibold text-gray-900 ml-3 hover:text-gray-700 transition-colors duration-150`}
        aria-label={label}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

export const Button: FC<PropsWithChildren<ButtonProps>> = memo(function Button({
  onClick: _onClick,
  to,
  children,
  cancel,
  disabled,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
  variant = "primary",
  size = "md",
  loading = false,
}) {
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    if (loading || disabled) return;
    if (to) {
      navigate(to);
    } else if (_onClick) {
      _onClick();
    }
  }, [to, _onClick, navigate, loading, disabled]);

  // Generate appropriate label based on context
  const label =
    ariaLabel ||
    (() => {
      if (typeof children === "string") {
        if (to) {
          return `Navigate to ${children}`;
        }
        if (type === "submit") {
          return `Submit ${children}`;
        }
        return children;
      }
      return undefined;
    })();

  if (cancel) {
    return (
      <CancelButton
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled || loading}
        size={size}
      >
        {children}
      </CancelButton>
    );
  }

  // Size classes
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs/5",
    md: "px-3 py-2 text-sm/6",
    lg: "px-4 py-2.5 text-base/7",
  };

  // Loading spinner size classes
  const spinnerSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // Variant classes - using !important modifier to ensure colors always take precedence over className
  const variantClasses = {
    primary:
      "!bg-teal-600 !text-white shadow-xs hover:!bg-teal-500 focus-visible:outline-teal-600 disabled:hover:!bg-teal-600",
    secondary:
      "!bg-white !text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:!bg-gray-50 focus-visible:outline-gray-600 disabled:hover:!bg-white",
    ghost:
      "!bg-transparent !text-gray-700 hover:!bg-gray-100 focus-visible:outline-gray-600 disabled:hover:!bg-transparent",
    danger:
      "!bg-red-600 !text-white shadow-xs hover:!bg-red-500 focus-visible:outline-red-600 disabled:hover:!bg-red-600",
  };

  const baseClasses =
    "relative inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap focus-visible:outline focus-visible:outline-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // Only apply scale on hover if not loading/disabled
  const hoverScaleClass =
    loading || disabled
      ? ""
      : "hover:scale-105 active:scale-95";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${hoverScaleClass} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      // eslint-disable-next-line react/no-unknown-property
      aria-clickable
      role="button"
      aria-label={loading ? `${label} (loading)` : label}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      className={combinedClasses}
    >
      {loading && (
        <svg
          className={`animate-spin -ml-1 mr-2 ${spinnerSizeClasses[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});
