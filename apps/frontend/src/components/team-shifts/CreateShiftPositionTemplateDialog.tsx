import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";

import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";

import { CreateShiftPositionTemplate } from "./CreateShiftPositionTemplate";

export interface CreateShiftPositionTemplateDialogProps {
  isDialogOpen: boolean;
  onClose: () => void;
  teamPk: string;
}

export const CreateShiftPositionTemplateDialog = ({
  isDialogOpen,
  onClose,
  teamPk,
}: CreateShiftPositionTemplateDialogProps) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={onClose}
      title={<Trans>Create shift position template</Trans>}
      aria-label={i18n.t("Create shift position template dialog")}
    >
      <div
        className="relative"
        role="region"
        aria-label="Shift position template form"
      >
        <Suspense>
          <CreateShiftPositionTemplate onClose={onClose} teamPk={teamPk} />
        </Suspense>
      </div>
    </Dialog>
  );
};
