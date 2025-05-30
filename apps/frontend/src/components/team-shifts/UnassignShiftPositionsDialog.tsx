import { Trans } from "@lingui/react/macro";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";
import ContextualHelp from "../molecules/ContextualHelp";
import { UnassignShiftPositions } from "./UnassignShiftPositions";

export interface UnassignShiftPositionsDialogProps {
  isDialogOpen: boolean;
  onClose: () => void;
  isHelpPanelOpen: boolean;
  setHelpPanelOpen: (helpPanelOpen: boolean) => void;
  teamPk: string;
}

export const UnassignShiftPositionsDialog = ({
  isDialogOpen,
  onClose,
  isHelpPanelOpen,
  teamPk,
  setHelpPanelOpen,
}: UnassignShiftPositionsDialogProps) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => onClose()}
      title={<Trans>Unassign shift positions</Trans>}
    >
      <div className="relative">
        <Suspense>
          <UnassignShiftPositions team={teamPk} onClose={() => onClose()} />
        </Suspense>
        {/* Help panel for unassign dialog */}
        <div
          className={`fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
            isHelpPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
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
        {/* Toggle help panel button */}
        <button
          type="button"
          onClick={() => setHelpPanelOpen(!isHelpPanelOpen)}
          className="fixed right-4 top-10 opacity-50 hover:opacity-100 bg-blue-400 text-white rounded-full p-3 shadow-lg hover:bg-blue-500 z-50"
        >
          <span className="sr-only">Toggle help panel</span>
          {isHelpPanelOpen ? (
            <XMarkIcon aria-hidden="true" className="size-6" />
          ) : (
            <QuestionMarkCircleIcon aria-hidden="true" className="size-6" />
          )}
        </button>
      </div>
    </Dialog>
  );
};
