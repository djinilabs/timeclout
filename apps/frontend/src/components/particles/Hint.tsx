import React, {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

interface HintProps {
  children: ReactNode;
  hint: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const Hint: React.FC<HintProps> = ({
  children,
  hint,
  position = "top",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case "right":
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
    }

    setTooltipPosition({ top, left });
  }, [position]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible, position, updatePosition]);

  const tooltip =
    isVisible &&
    createPortal(
      <div
        ref={tooltipRef}
        className={`
        fixed z-[9999]
        px-3 py-2
        bg-gray-900 text-white
        text-sm rounded-md
        shadow-lg
        ${className}
      `}
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        {hint}
        <div
          className={`
          absolute w-2 h-2 bg-gray-900 transform rotate-45
          ${position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" : ""}
          ${position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" : ""}
          ${position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" : ""}
          ${position === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" : ""}
        `}
        />
      </div>,
      document.body
    );

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {tooltip}
    </div>
  );
};
