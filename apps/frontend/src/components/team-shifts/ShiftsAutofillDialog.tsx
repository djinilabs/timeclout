import { useMemo } from "react";
import { DayDate, DayDateInterval } from "@/day-date";
import { Trans } from "@lingui/react/macro";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog } from "../atoms/Dialog";
import { Suspense } from "../atoms/Suspense";
import { classNames } from "../../utils/classNames";
import ContextualHelp from "../molecules/ContextualHelp";
import { ShiftsAutoFill } from "./ShiftsAutoFill";

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
        <div
          className={`fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
            helpPanelOpen ? "translate-x-0" : "translate-x-full"
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
            {helpPanelOpen ? (
              <Suspense>
                <ContextualHelp
                  isOpen={helpPanelOpen}
                  setIsOpen={setHelpPanelOpen}
                />
              </Suspense>
            ) : null}
          </div>
        </div>
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
