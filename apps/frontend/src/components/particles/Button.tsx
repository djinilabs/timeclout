import { FC, PropsWithChildren, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

export interface ButtonProperties {
  onClick?: () => void;
  to?: string;
  cancel?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  "aria-label"?: string;
}

const CancelButton: FC<PropsWithChildren<ButtonProperties>> = memo(
  function CancelButton({
    onClick,
    children,
    "aria-label": ariaLabel,
    disabled,
  }) {
    // For cancel buttons, we want to be explicit about the action
    const label =
      ariaLabel ||
      (typeof children === "string" ? `${children} action` : "Cancel action");
    return (
      <button
        onClick={onClick}
        type="button"
        className="text-sm/6 font-semibold text-gray-900 ml-3"
        aria-label={label}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

export const Button: FC<PropsWithChildren<ButtonProperties>> = memo(function Button({
  onClick: _onClick,
  to,
  children,
  cancel,
  disabled,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
}) {
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    if (to) {
      navigate(to);
    } else if (_onClick) {
      _onClick();
    }
  }, [to, _onClick, navigate]);

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
      return;
    })();

  if (cancel) {
    return (
      <CancelButton
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {children}
      </CancelButton>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      // eslint-disable-next-line react/no-unknown-property
      aria-clickable
      role="button"
      aria-label={label}
      aria-disabled={disabled}
      className={
        className ||
        `relative inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 hover:scale-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:hover:scale-100 transition duration-300`
      }
    >
      {children}
    </button>
  );
});
