import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";

import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { useMutation } from "../../hooks/useMutation";
import { useSearchParam } from "../../hooks/useSearchParam";
import { DayPicker } from "../atoms/DayPicker";
import { Button } from "../particles/Button";

import { DayDate } from "@/day-date";
import revertShiftPositionsMutation from "@/graphql-client/mutations/revertShiftPositions.graphql";

export interface RevertShiftPositionsProps {
  team: string;
  onClose: () => void;
  onRevert?: () => void;
}

export const RevertShiftPositions: FC<RevertShiftPositionsProps> = ({
  team,
  onClose,
  onRevert,
}) => {
  const { current: month } = useSearchParam("month");
  const [dateRange, setDateRange] = useState<{
    from: DayDate;
    to: DayDate;
  }>(() => {
    const firstOfMonth = month
      ? new DayDate(month)
      : DayDate.today().firstOfMonth();
    const lastOfMonth = firstOfMonth.endOfMonth();
    return {
      from: firstOfMonth,
      to: lastOfMonth,
    };
  });

  const [{ fetching }, revertShiftPositions] = useMutation(
    revertShiftPositionsMutation
  );

  const { showConfirmDialog } = useConfirmDialog();

  const handleRevert = useCallback(async () => {
    if (
      !(await showConfirmDialog({
        text: (
          <Trans>
            Are you sure you want to revert the changes made to the shift
            positions for this team between {dateRange.from.toHumanString()} and{" "}
            {dateRange.to.toHumanString()}?
          </Trans>
        ),
      }))
    ) {
      return;
    }
    const result = await revertShiftPositions({
      input: {
        team,
        startDay: dateRange.from.toString(),
        endDay: dateRange.to.toString(),
        version: "staging",
      },
    });

    if (!result.error) {
      toast.success(i18n.t("Shift positions reverted successfully"));
      onRevert?.();
      onClose();
    }
  }, [
    showConfirmDialog,
    dateRange.from,
    dateRange.to,
    revertShiftPositions,
    team,
    onRevert,
    onClose,
  ]);

  return (
    <div
      className="space-y-4"
      role="dialog"
      aria-labelledby="revert-shifts-title"
    >
      <h2 id="revert-shifts-title" className="sr-only">
        <Trans>Revert Shift Positions</Trans>
      </h2>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="date-range-picker"
        >
          <Trans>Date range</Trans>
        </label>
        <DayPicker
          id="date-range-picker"
          mode="range"
          required
          numberOfMonths={2}
          selected={{
            from: dateRange.from.toDate(),
            to: dateRange.to.toDate(),
          }}
          defaultMonth={dateRange.from.toDate()}
          onSelectRange={(range) => {
            if (range?.from && range?.to) {
              setDateRange({
                from: new DayDate(range.from),
                to: new DayDate(range.to),
              });
            }
          }}
          aria-label={i18n.t("Select date range for reverting shift positions")}
        />
      </div>
      <div
        className="flex justify-end space-x-2"
        role="toolbar"
        aria-label={i18n.t("Revert shift actions")}
      >
        <Button
          onClick={onClose}
          cancel
          aria-label={i18n.t("Cancel reverting shift positions")}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button
          onClick={handleRevert}
          disabled={fetching}
          aria-label={i18n.t("Revert shift positions for selected date range")}
          aria-busy={fetching}
        >
          <Trans>
            Revert shift positions from {dateRange.from.toHumanString()} to{" "}
            {dateRange.to.toHumanString()}
          </Trans>
        </Button>
      </div>
    </div>
  );
};
