import { FC, lazy, Suspense } from "react";
import { useAppLocalSettings } from "../../contexts/AppLocalSettingsContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ContextualHelp = lazy(() => import("../particles/ContextualHelp"));

export interface HelpPanelProps {
  isHelpPanelOpen: boolean;
  setHelpPanelOpen: (isOpen: boolean) => unknown;
}

export const HelpPanel: FC<HelpPanelProps> = ({
  isHelpPanelOpen,
  setHelpPanelOpen,
}) => {
  const {
    settings: { helpSideBarWidth },
  } = useAppLocalSettings();

  return (
    <div
      className={`fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isHelpPanelOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={
        isHelpPanelOpen
          ? {
              width: `${helpSideBarWidth}px`,
            }
          : undefined
      }
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Help</h2>
        <button
          type="button"
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
