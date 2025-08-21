import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";

import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";

import { CreateOrEditScheduleDayTemplate } from "./CreateOrEditScheduleDayTemplate";

export interface CreateOrEditScheduleDayTemplateDialogProps {
  isDialogOpen: boolean;
  onClose: () => void;
  teamPk: string;
}

export const CreateOrEditScheduleDayTemplateDialog = ({
  isDialogOpen,
  onClose,
  teamPk,
}: CreateOrEditScheduleDayTemplateDialogProps) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={onClose}
      title={<Trans>Create or edit schedule day template</Trans>}
      aria-label={i18n.t("Create or edit schedule day template dialog")}
    >
      <div
        className="relative"
        role="region"
        aria-label="Schedule day template form"
      >
        <Suspense>
          <CreateOrEditScheduleDayTemplate onClose={onClose} teamPk={teamPk} />
        </Suspense>
      </div>
    </Dialog>
  );
};
