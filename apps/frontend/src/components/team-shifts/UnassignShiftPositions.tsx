import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";

import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { useMutation } from "../../hooks/useMutation";
import { useSearchParam as useSearchParameter } from "../../hooks/useSearchParam";
import { DayPicker } from "../atoms/DayPicker";
import { Button } from "../particles/Button";

import { DayDate } from "@/day-date";
import unassignShiftPositionsMutation from "@/graphql-client/mutations/unassignShiftPositions.graphql";

export interface UnassignShiftPositionsProperties {
  team: string;
  onClose: () => void;
  onUnassign?: () => void;
}

export const UnassignShiftPositions: FC<UnassignShiftPositionsProperties> = ({
  team,
  onClose,
  onUnassign,
}) => {
  const { current: month } = useSearchParameter("month");
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

  const [{ fetching }, unassignShiftPositions] = useMutation(
    unassignShiftPositionsMutation
  );

  const { showConfirmDialog } = useConfirmDialog();

  const handleUnassign = useCallback(async () => {
    if (
      !(await showConfirmDialog({
        text: (
          <Trans>
            Are you sure you want to unassign the shift positions between{" "}
            {dateRange.from.toHumanString()} and {dateRange.to.toHumanString()}?
          </Trans>
        ),
      }))
    ) {
      return;
    }
    const result = await unassignShiftPositions({
      input: {
        team,
        startDay: dateRange.from.toString(),
        endDay: dateRange.to.toString(),
      },
    });

    if (!result.error) {
      toast.success(i18n.t("Shift positions unassigned successfully"));
      onUnassign?.();
      onClose();
    }
  }, [
    dateRange,
    onClose,
    onUnassign,
    team,
    unassignShiftPositions,
    showConfirmDialog,
  ]);

  return (
    <div
      className="space-y-4"
      role="dialog"
      aria-labelledby="unassign-shifts-title"
    >
      <h2 id="unassign-shifts-title" className="sr-only">
        <Trans>Unassign Shift Positions</Trans>
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
          aria-label={i18n.t(
            "Select date range for unassigning shift positions"
          )}
        />
      </div>
      <div
        className="flex justify-end space-x-2"
        role="toolbar"
        aria-label={i18n.t("Unassign shift actions")}
      >
        <Button
          onClick={onClose}
          cancel
          aria-label={i18n.t("Cancel unassigning shift positions")}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button
          onClick={handleUnassign}
          disabled={fetching}
          aria-label={i18n.t(
            "Unassign shift positions for selected date range"
          )}
          aria-busy={fetching}
        >
          <Trans>
            Unassign shift positions from {dateRange.from.toHumanString()} to{" "}
            {dateRange.to.toHumanString()}
          </Trans>
        </Button>
      </div>
    </div>
  );
};
