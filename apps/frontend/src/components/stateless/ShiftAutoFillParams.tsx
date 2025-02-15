import { FC, useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { DayDate } from "@/day-date";
import { RangeSlider } from "./RangeSlider";
import { LabeledSwitch } from "./LabeledSwitch";

export interface ShiftAutoFillParamValues {
  startDate: DayDate;
  endDate: DayDate;
  workerInconvenienceEquality: number;
  workerSlotEquality: number;
  workerSlotProximity: number;
  respectLeaveSchedule: boolean;
  requireMaximumIntervalBetweenShifts: boolean;
  maximumIntervalBetweenShifts: number;
}

export interface ShiftAutoFillParamsProps {
  initialStartDate: DayDate;
  initialEndDate: DayDate;
  initialWorkerInconvenienceEquality: number;
  initialWorkerSlotEquality: number;
  initialWorkerSlotProximity: number;
  initialRequireMaximumIntervalBetweenShifts: boolean;
  initialMaximumIntervalBetweenShifts: number;
  onChange: (params: ShiftAutoFillParamValues) => void;
}

export const ShiftAutoFillParams: FC<ShiftAutoFillParamsProps> = ({
  initialStartDate,
  initialEndDate,
  initialWorkerInconvenienceEquality,
  initialWorkerSlotEquality,
  initialWorkerSlotProximity,
  initialRequireMaximumIntervalBetweenShifts,
  initialMaximumIntervalBetweenShifts,
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

  const [respectLeaveSchedule, setRespectLeaveSchedule] = useState(true);
  const [
    requireMaximumIntervalBetweenShifts,
    setRequireMaximumIntervalBetweenShifts,
  ] = useState(initialRequireMaximumIntervalBetweenShifts);
  const [maximumIntervalBetweenShifts, setMaximumIntervalBetweenShifts] =
    useState(initialMaximumIntervalBetweenShifts);

  useEffect(() => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      onChange({
        startDate: new DayDate(selectedDateRange.from),
        endDate: new DayDate(selectedDateRange.to),
        workerInconvenienceEquality: workerInconvenienceEquality / 100,
        workerSlotEquality: workerSlotEquality / 100,
        workerSlotProximity: workerSlotProximity / 100,
        respectLeaveSchedule,
        requireMaximumIntervalBetweenShifts,
        maximumIntervalBetweenShifts,
      });
    }
  }, [
    onChange,
    selectedDateRange,
    workerInconvenienceEquality,
    workerSlotEquality,
    workerSlotProximity,
    respectLeaveSchedule,
    requireMaximumIntervalBetweenShifts,
    maximumIntervalBetweenShifts,
  ]);

  return (
    <div className="grid grid-cols-3 gap-0">
      <div className="col-span-2">
        <div className="grid grid-cols-1 gap-0">
          <h3 className="mt-5 text-base font-semibold text-gray-900">
            Date range
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Select the period for which you want to automatically assign shifts
          </p>
          <DayPicker
            mode="range"
            ISOWeek
            timeZone="UTC"
            numberOfMonths={2}
            defaultMonth={selectedDateRange?.from}
            selected={selectedDateRange}
            onSelect={setSelectedDateRange}
          />
        </div>
        <div className="grid grid-cols-1 gap-0">
          <h3 className="mt-5 text-base font-semibold text-gray-900">Rules</h3>
          <p className="text-sm text-gray-400 mb-4">
            Select the rules for which you want to enforce while automatically
            assign shifts
          </p>
          <div className="grid grid-cols-1 gap-3">
            <LabeledSwitch
              label="Respect leave schedule"
              checked={respectLeaveSchedule}
              onChange={setRespectLeaveSchedule}
            />
            <div>
              <div className="flex items-center">
                <LabeledSwitch
                  label="Require a maximum interval between shifts for each worker (in days)"
                  checked={requireMaximumIntervalBetweenShifts}
                  onChange={setRequireMaximumIntervalBetweenShifts}
                />
                {requireMaximumIntervalBetweenShifts && (
                  <input
                    type="number"
                    value={maximumIntervalBetweenShifts}
                    min={1}
                    className="w-16 text-right"
                    disabled={!requireMaximumIntervalBetweenShifts}
                    onChange={(e) =>
                      setMaximumIntervalBetweenShifts(parseInt(e.target.value))
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mt-5 text-base font-semibold text-gray-900">
          Fine-tune parameters
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Adjust these parameters to control how the automatic assignment
          balances different priorities
        </p>
        <dl className="mt-5 grid grid-cols-1 gap-5">
          <div>
            <div
              key="worker-inconvenience-equality"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                Worker Inconvenience Equality
              </dt>
              <p className="text-sm text-gray-400 mt-1">
                Higher values ensure workers get similar levels of inconvenient
                shifts (nights, weekends)
              </p>
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
                Worker Shift Equality
              </dt>
              <p className="text-sm text-gray-400 mt-1">
                Higher values ensure workers get a more equal distribution of
                total shifts
              </p>
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
                Worker Shift Proximity
              </dt>
              <p className="text-sm text-gray-400 mt-1">
                Higher values try to group shifts together, avoiding isolated
                shifts for workers
              </p>
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
    </div>
  );
};
