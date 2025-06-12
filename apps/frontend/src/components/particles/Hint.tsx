import React, {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
  ElementType,
} from "react";
import { createPortal } from "react-dom";

interface HintProps {
  children?: ReactNode;
  hint: string;
  role?: string;
  position?: "top" | "bottom" | "left" | "right" | "auto";
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
}

export const Hint: React.FC<HintProps> = ({
  children,
  hint,
  role = "hint",
  position = "auto",
  className = "",
  style = {},
  as: Component = "div",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [calculatedPosition, setCalculatedPosition] = useState<
    "top" | "bottom" | "left" | "right"
  >("top");
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculateBestPosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return "top";

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    const positions = [
      { pos: "bottom", space: spaceBelow },
      { pos: "top", space: spaceAbove },
      { pos: "right", space: spaceRight },
      { pos: "left", space: spaceLeft },
    ];

    // Sort positions by available space, descending
    positions.sort((a, b) => b.space - a.space);

    // Return the position with the most space
    return positions[0].pos as "top" | "bottom" | "left" | "right";
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const actualPosition = position === "auto" ? calculatedPosition : position;

    switch (actualPosition) {
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
  }, [position, calculatedPosition]);

  useEffect(() => {
    if (isVisible) {
      if (position === "auto") {
        setCalculatedPosition(calculateBestPosition());
      }
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [
    isVisible,
    position,
    calculatedPosition,
    updatePosition,
    calculateBestPosition,
  ]);

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
          ${
            calculatedPosition === "top"
              ? "bottom-[-4px] left-1/2 -translate-x-1/2"
              : ""
          }
          ${
            calculatedPosition === "bottom"
              ? "top-[-4px] left-1/2 -translate-x-1/2"
              : ""
          }
          ${
            calculatedPosition === "left"
              ? "right-[-4px] top-1/2 -translate-y-1/2"
              : ""
          }
          ${
            calculatedPosition === "right"
              ? "left-[-4px] top-1/2 -translate-y-1/2"
              : ""
          }
        `}
        />
      </div>,
      document.body
    );

  return (
    <Component
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={className}
      style={style}
      role={role}
      aria-label={hint}
    >
      {children}
      {tooltip}
    </Component>
  );
};
