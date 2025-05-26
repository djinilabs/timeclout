import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { DayDate } from "@/day-date";
import unassignShiftPositionsMutation from "@/graphql-client/mutations/unassignShiftPositions.graphql";
import { Button } from "../particles/Button";
import { DayPicker } from "../atoms/DayPicker";
import { useMutation } from "../../hooks/useMutation";

export interface UnassignShiftPositionsProps {
  team: string;
  onClose: () => void;
  onUnassign?: () => void;
}

export const UnassignShiftPositions: FC<UnassignShiftPositionsProps> = ({
  team,
  onClose,
  onUnassign,
}) => {
  const [dateRange, setDateRange] = useState<{
    from: DayDate;
    to: DayDate;
  }>({
    from: DayDate.today(),
    to: DayDate.today(),
  });

  const [{ fetching }, unassignShiftPositions] = useMutation(
    unassignShiftPositionsMutation
  );

  const handleUnassign = useCallback(async () => {
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
  }, [dateRange, onClose, onUnassign, team, unassignShiftPositions]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Trans>Date range</Trans>
        </label>
        <DayPicker
          mode="range"
          required
          selected={{
            from: dateRange.from.toDate(),
            to: dateRange.to.toDate(),
          }}
          onSelectRange={(range) => {
            if (range?.from && range?.to) {
              setDateRange({
                from: new DayDate(range.from),
                to: new DayDate(range.to),
              });
            }
          }}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} cancel>
          <Trans>Cancel</Trans>
        </Button>
        <Button onClick={handleUnassign} disabled={fetching}>
          <Trans>Unassign</Trans>
        </Button>
      </div>
    </div>
  );
};
