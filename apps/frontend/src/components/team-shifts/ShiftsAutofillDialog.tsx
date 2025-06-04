import { useMemo } from "react";
import { DayDate, DayDateInterval } from "@/day-date";
import { Trans } from "@lingui/react/macro";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";
import { classNames } from "../../utils/classNames";
import { ShiftsAutoFill } from "./ShiftsAutoFill";
import { HelpPanel } from "../atoms/HelpPanel";

export interface ShiftsAutofillDialogProps {
  isDialogOpen: boolean;
  onClose: () => void;
  helpPanelOpen: boolean;
  setHelpPanelOpen: (helpPanelOpen: boolean) => void;
  teamPk: string;
  selectedMonth: DayDate;
}

export const ShiftsAutofillDialog = ({
  isDialogOpen,
  onClose,
  helpPanelOpen,
  setHelpPanelOpen,
  teamPk,
  selectedMonth,
}: ShiftsAutofillDialogProps) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => onClose()}
      title={<Trans>Auto fill</Trans>}
      className="w-screen min-h-screen"
    >
      <div className={classNames("relative", helpPanelOpen ? "pr-72" : "")}>
        <Suspense>
          <ShiftsAutoFill
            team={teamPk}
            startRange={useMemo(
              () =>
                new DayDateInterval(
                  selectedMonth.firstOfMonth(),
                  selectedMonth.nextMonth(1).previousDay()
                ),
              [selectedMonth]
            )}
            onAssignShiftPositions={() => {
              onClose();
            }}
          />
        </Suspense>
        {/* Help panel for auto fill dialog */}
        <HelpPanel
          isHelpPanelOpen={helpPanelOpen}
          setHelpPanelOpen={setHelpPanelOpen}
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
