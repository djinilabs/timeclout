import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { DayDate } from "@/day-date";
import publishShiftPositionsMutation from "@/graphql-client/mutations/publishShiftPositions.graphql";
import { Button } from "../particles/Button";
import { DayPicker } from "../atoms/DayPicker";
import { useMutation } from "../../hooks/useMutation";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { useSearchParam } from "../../hooks/useSearchParam";

export interface PublishShiftPositionsProps {
  team: string;
  onClose: () => void;
  onPublish?: () => void;
}

export const PublishShiftPositions: FC<PublishShiftPositionsProps> = ({
  team,
  onClose,
  onPublish,
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

  const [{ fetching }, publishShiftPositions] = useMutation(
    publishShiftPositionsMutation
  );

  const { showConfirmDialog } = useConfirmDialog();

  const handlePublish = useCallback(async () => {
    if (
      !(await showConfirmDialog({
        text: (
          <Trans>
            Are you sure you want to publish the shift positions for this team
            between {dateRange.from.toHumanString()} and{" "}
            {dateRange.to.toHumanString()}?
          </Trans>
        ),
      }))
    ) {
      return;
    }
    const result = await publishShiftPositions({
      input: {
        team,
        startDay: dateRange.from.toString(),
        endDay: dateRange.to.toString(),
      },
    });

    if (!result.error) {
      toast.success(i18n.t("Shift positions published successfully"));
      onPublish?.();
      onClose();
    }
  }, [
    showConfirmDialog,
    dateRange.from,
    dateRange.to,
    publishShiftPositions,
    team,
    onPublish,
    onClose,
  ]);

  return (
    <div
      className="space-y-4"
      role="dialog"
      aria-labelledby="unassign-shifts-title"
    >
      <h2 id="unassign-shifts-title" className="sr-only">
        <Trans>Publish Shift Positions</Trans>
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
            "Select date range for publishing shift positions"
          )}
        />
      </div>
      <div
        className="flex justify-end space-x-2"
        role="toolbar"
        aria-label={i18n.t("Publish shift actions")}
      >
        <Button
          onClick={onClose}
          cancel
          aria-label={i18n.t("Cancel publishing shift positions")}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button
          onClick={handlePublish}
          disabled={fetching}
          aria-label={i18n.t("Publish shift positions for selected date range")}
          aria-busy={fetching}
        >
          <Trans>
            Publish shift positions from {dateRange.from.toHumanString()} to{" "}
            {dateRange.to.toHumanString()}
          </Trans>
        </Button>
      </div>
    </div>
  );
};
