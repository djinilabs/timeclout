import { Trans } from "@lingui/react/macro";
import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";
import { RevertShiftPositions } from "./RevertShiftPositions";

export interface RevertShiftPositionsDialogProps {
  isDialogOpen: boolean;
  onClose: () => void;
  onRevert: () => void;
  teamPk: string;
}

export const RevertShiftPositionsDialog = ({
  isDialogOpen,
  onClose,
  onRevert,
  teamPk,
}: RevertShiftPositionsDialogProps) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => onClose()}
      title={<Trans>Revert shift positions</Trans>}
      aria-label="Revert shift positions dialog"
    >
      <div
        className="relative"
        role="region"
        aria-label="Revert shift positions content"
      >
        <Suspense>
          <RevertShiftPositions
            team={teamPk}
            onClose={onClose}
            onRevert={onRevert}
          />
        </Suspense>
      </div>
    </Dialog>
  );
};
