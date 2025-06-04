import { DayDate } from "@/day-date";
import { Trans } from "@lingui/react/macro";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog } from "../atoms/Dialog";
import { CreateOrEditScheduleShiftPosition } from "./CreateOrEditScheduleShiftPosition";
import { Suspense } from "../atoms/Suspense";
import { useTeamShiftActions } from "../../hooks/useTeamShiftActions";
import { ShiftPosition } from "../../graphql/graphql";
import { HelpPanel } from "../atoms/HelpPanel";

export interface CreateOrEditScheduleShiftPositionDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  isHelpPanelOpen: boolean;
  editingShiftPosition?: ShiftPosition;
  focusedDay?: DayDate;
  selectedMonth: DayDate;
  setIsHelpPanelOpen: (isHelpPanelOpen: boolean) => void;
  helpPanelOpen: boolean;
  setHelpPanelOpen: (helpPanelOpen: boolean) => void;
}

export const CreateOrEditScheduleShiftPositionDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  isHelpPanelOpen,
  editingShiftPosition,
  focusedDay,
  selectedMonth,
  setIsHelpPanelOpen,
  helpPanelOpen,
  setHelpPanelOpen,
}: CreateOrEditScheduleShiftPositionDialogProps) => {
  const { createShiftPosition, updateShiftPosition } = useTeamShiftActions();

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      title={
        editingShiftPosition ? (
          <Trans>Edit position</Trans>
        ) : (
          <Trans>Insert position into the team schedule</Trans>
        )
      }
    >
      <div className="relative">
        <Suspense>
          <CreateOrEditScheduleShiftPosition
            editingShiftPosition={editingShiftPosition}
            day={focusedDay ?? selectedMonth}
            onCancel={() => setIsDialogOpen(false)}
            onCreate={async (params) => {
              if (await createShiftPosition(params)) {
                setIsDialogOpen(false);
              }
            }}
            onUpdate={async (params) => {
              if (await updateShiftPosition(params)) {
                setIsDialogOpen(false);
              }
            }}
          />
        </Suspense>
        {/* Help panel for create/edit dialog */}
        <HelpPanel
          isHelpPanelOpen={isHelpPanelOpen}
          setHelpPanelOpen={setIsHelpPanelOpen}
        />
        {/* Toggle help panel button */}
        <button
          type="button"
          onClick={() => setHelpPanelOpen(!helpPanelOpen)}
          className="fixed right-2 top-12 opacity-50 hover:opacity-100 bg-blue-400 text-white rounded-full p-3 shadow-lg hover:bg-blue-500 z-50"
        >
          <span className="sr-only">Toggle help panel</span>
          {helpPanelOpen ? (
            <XMarkIcon aria-hidden="true" className="size-6" />
          ) : (
            <QuestionMarkCircleIcon aria-hidden="true" className="size-6" />
          )}
        </button>
      </div>
    </Dialog>
  );
};
