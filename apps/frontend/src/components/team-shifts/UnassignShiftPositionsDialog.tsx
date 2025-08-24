import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Trans } from "@lingui/react/macro";

import { Dialog } from "../atoms/Dialog";
import { HelpPanel } from "../atoms/HelpPanel";
import { Suspense } from "../atoms/Suspense";

import { UnassignShiftPositions } from "./UnassignShiftPositions";

export interface UnassignShiftPositionsDialogProperties {
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
}: UnassignShiftPositionsDialogProperties) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => onClose()}
      title={<Trans>Unassign shift positions</Trans>}
      aria-label="Unassign shift positions dialog"
    >
      <div
        className="relative"
        role="region"
        aria-label="Unassign shift positions content"
      >
        <Suspense>
          <UnassignShiftPositions team={teamPk} onClose={() => onClose()} />
        </Suspense>
        {/* Help panel for unassign dialog */}
        <HelpPanel
          isHelpPanelOpen={isHelpPanelOpen}
          setHelpPanelOpen={setHelpPanelOpen}
        />
        {/* Toggle help panel button */}
        <button
          type="button"
          onClick={() => setHelpPanelOpen(!isHelpPanelOpen)}
          className="fixed right-4 top-10 opacity-50 hover:opacity-100 bg-blue-400 text-white rounded-full p-3 shadow-lg hover:bg-blue-500 z-50"
          aria-expanded={isHelpPanelOpen}
          aria-controls="help-panel"
          aria-label={isHelpPanelOpen ? "Close help panel" : "Open help panel"}
        >
          <span className="sr-only">
            {isHelpPanelOpen ? "Close help panel" : "Open help panel"}
          </span>
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
