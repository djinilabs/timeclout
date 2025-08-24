import { XMarkIcon } from "@heroicons/react/24/outline";
import React, {
  FC,
  lazy,
  Suspense,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";

import { useAppLocalSettings } from "../../contexts/AppLocalSettingsContext";

const ContextualHelp = lazy(() => import("../particles/ContextualHelp"));

export interface HelpPanelProperties {
  isHelpPanelOpen: boolean;
  setHelpPanelOpen: (isOpen: boolean) => unknown;
}

export const HelpPanel: FC<HelpPanelProperties> = ({
  isHelpPanelOpen,
  setHelpPanelOpen,
}) => {
  const {
    settings: { helpSideBarWidth },
    setHelpSideBarWidth,
  } = useAppLocalSettings();

  const [isResizing, setIsResizing] = useState(false);
  const startXReference = useRef<number>(0);
  const startWidthReference = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent text selection during drag
      setIsResizing(true);
      startXReference.current = e.clientX;
      startWidthReference.current = helpSideBarWidth;
    },
    [helpSideBarWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = startXReference.current - e.clientX;
      const newWidth = Math.max(
        288,
        Math.min(800, startWidthReference.current + deltaX)
      );
      setHelpSideBarWidth(newWidth);
    },
    [isResizing, setHelpSideBarWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      globalThis.addEventListener("mousemove", handleMouseMove);
      globalThis.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`fixed z-500 inset-y-0 right-0 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isHelpPanelOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={
        isHelpPanelOpen
          ? {
              width: `${helpSideBarWidth}px`,
            }
          : undefined
      }
      onMouseMove={(e) => {
        const isNearBorder =
          e.clientX - e.currentTarget.getBoundingClientRect().left <= 5;
        e.currentTarget.style.cursor = isNearBorder ? "ew-resize" : "default";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = "default";
      }}
      onMouseDown={(e) => {
        // Only handle mouse down if it's on the left border (within 5px of the left edge)
        if (e.clientX - e.currentTarget.getBoundingClientRect().left <= 5) {
          handleMouseDown(e);
        }
      }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Help</h2>
        <button
          type="button"
          aria-label="Close help panel"
          aria-hidden
          onClick={() => setHelpPanelOpen(false)}
          className="-m-2.5 p-2.5 text-gray-700"
        >
          <span className="sr-only">Close help panel</span>
          <XMarkIcon aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
        {isHelpPanelOpen ? (
          <Suspense>
            <ContextualHelp
              isOpen={isHelpPanelOpen}
              setIsOpen={setHelpPanelOpen}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};
