import { FC, useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { DayDate } from "@/day-date";
import { RangeSlider } from "./RangeSlider";

export interface ShiftAutoFillParamValues {
  startDate: DayDate;
  endDate: DayDate;
  workerInconvenienceEquality: number;
  workerSlotEquality: number;
  workerSlotProximity: number;
}

export interface ShiftAutoFillParamsProps {
  initialStartDate: DayDate;
  initialEndDate: DayDate;
  initialWorkerInconvenienceEquality: number;
  initialWorkerSlotEquality: number;
  initialWorkerSlotProximity: number;
  onChange: (params: ShiftAutoFillParamValues) => void;
}

export const ShiftAutoFillParams: FC<ShiftAutoFillParamsProps> = ({
  initialStartDate,
  initialEndDate,
  initialWorkerInconvenienceEquality,
  initialWorkerSlotEquality,
  initialWorkerSlotProximity,
  onChange,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({ from: initialStartDate.toDate(), to: initialEndDate.toDate() });

  const [workerInconvenienceEquality, setWorkerInconvenienceEquality] =
    useState(initialWorkerInconvenienceEquality * 100);
  const [workerSlotEquality, setWorkerSlotEquality] = useState(
    initialWorkerSlotEquality * 100
  );
  const [workerSlotProximity, setWorkerSlotProximity] = useState(
    initialWorkerSlotProximity * 100
  );

  useEffect(() => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      onChange({
        startDate: new DayDate(selectedDateRange.from),
        endDate: new DayDate(selectedDateRange.to),
        workerInconvenienceEquality: workerInconvenienceEquality / 100,
        workerSlotEquality: workerSlotEquality / 100,
        workerSlotProximity: workerSlotProximity / 100,
      });
    }
  }, [
    onChange,
    selectedDateRange,
    workerInconvenienceEquality,
    workerSlotEquality,
    workerSlotProximity,
  ]);

  return (
    <div>
      <DayPicker
        mode="range"
        ISOWeek
        timeZone="UTC"
        numberOfMonths={2}
        defaultMonth={selectedDateRange?.from}
        selected={selectedDateRange}
        onSelect={setSelectedDateRange}
      />
      <h3 className="mt-5 text-base font-semibold text-gray-900">
        Fine-tune parameters
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <div
            key="worker-inconvenience-equality"
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              Worker Inconvenience Equality
            </dt>
            <dd className="space-y-2">
              <RangeSlider
                min={0}
                max={100}
                value={workerInconvenienceEquality}
                onChange={setWorkerInconvenienceEquality}
              />
              <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
                {workerInconvenienceEquality}%
              </div>
            </dd>
          </div>
        </div>
        <div>
          <div
            key="worker-slot-equality"
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              Worker Slot Equality
            </dt>
            <RangeSlider
              min={0}
              max={100}
              value={workerSlotEquality}
              onChange={setWorkerSlotEquality}
            />
            <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
              {workerSlotEquality}%
            </div>
          </div>
        </div>
        <div>
          <div
            key="worker-slot-proximity"
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              Worker Slot Proximity
            </dt>
            <RangeSlider
              min={0}
              max={100}
              value={workerSlotProximity}
              onChange={setWorkerSlotProximity}
            />
            <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
              {workerSlotProximity}%
            </div>
          </div>
        </div>
      </dl>
    </div>
  );
};
