import { Trans } from "@lingui/react/macro";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";
import { UnassignShiftPositions } from "./UnassignShiftPositions";
import { HelpPanel } from "../atoms/HelpPanel";

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
        <HelpPanel
          isHelpPanelOpen={isHelpPanelOpen}
          setHelpPanelOpen={setHelpPanelOpen}
        />
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
