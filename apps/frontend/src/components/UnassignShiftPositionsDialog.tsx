import { FC, useCallback, useState } from "react";
import { Trans } from "@lingui/react/macro";
import { DayDate } from "@/day-date";
import { Button } from "./stateless/Button";
import { DayPicker } from "./stateless/DayPicker";
import { useMutation } from "../hooks/useMutation";
import unassignShiftPositionsMutation from "@/graphql-client/mutations/unassignShiftPositions.graphql";
import toast from "react-hot-toast";
import { i18n } from "@lingui/core";

export interface UnassignShiftPositionsDialogProps {
  team: string;
  onClose: () => void;
  onUnassign: () => void;
}

export const UnassignShiftPositionsDialog: FC<
  UnassignShiftPositionsDialogProps
> = ({ team, onClose, onUnassign }) => {
  const [startDate, setStartDate] = useState<DayDate>(DayDate.today());
  const [endDate, setEndDate] = useState<DayDate>(DayDate.today());

  const [{ fetching }, unassignShiftPositions] = useMutation(
    unassignShiftPositionsMutation
  );

  const handleUnassign = useCallback(async () => {
    const result = await unassignShiftPositions({
      input: {
        team,
        startDay: startDate.toString(),
        endDay: endDate.toString(),
      },
    });

    if (!result.error) {
      toast.success(i18n.t("Shift positions unassigned successfully"));
      onUnassign();
      onClose();
    }
  }, [endDate, onClose, onUnassign, startDate, team, unassignShiftPositions]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Trans>Start date</Trans>
        </label>
        <DayPicker
          mode="single"
          ISOWeek
          timeZone="UTC"
          required
          selected={startDate.toDate()}
          onSelect={(date) => date && setStartDate(new DayDate(date))}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Trans>End date</Trans>
        </label>
        <DayPicker
          mode="single"
          ISOWeek
          timeZone="UTC"
          required
          selected={endDate.toDate()}
          onSelect={(date) => date && setEndDate(new DayDate(date))}
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
