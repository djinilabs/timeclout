import { Trans } from "@lingui/react/macro";

import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";

import { PublishShiftPositions } from "./PublishShiftPositions";

export interface PublishShiftPositionsDialogProperties {
  isDialogOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  teamPk: string;
}

export const PublishShiftPositionsDialog = ({
  isDialogOpen,
  onClose,
  onPublish,
  teamPk,
}: PublishShiftPositionsDialogProperties) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => onClose()}
      title={<Trans>Publish shift positions</Trans>}
      aria-label="Publish shift positions dialog"
    >
      <div
        className="relative"
        role="region"
        aria-label="Publish shift positions content"
      >
        <Suspense>
          <PublishShiftPositions
            team={teamPk}
            onClose={onClose}
            onPublish={onPublish}
          />
        </Suspense>
      </div>
    </Dialog>
  );
};
