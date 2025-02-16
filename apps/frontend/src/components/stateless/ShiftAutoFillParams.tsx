import { FC, useCallback } from "react";
import { DayPicker } from "react-day-picker";
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
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean;
  minimumNumberOfShiftsPerWeekInStandardWorkday: number;
}

export interface ShiftAutoFillParamsProps extends ShiftAutoFillParamValues {
  onChange: (params: ShiftAutoFillParamValues) => void;
}

export const ShiftAutoFillParams: FC<ShiftAutoFillParamsProps> = ({
  onChange,
  ...params
}) => {
  const setProp = useCallback(
    (key: keyof ShiftAutoFillParamValues) =>
      (value: ShiftAutoFillParamValues[keyof ShiftAutoFillParamValues]) => {
        onChange({
          ...params,
          [key]: value,
        });
      },
    [onChange, params]
  );

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
            defaultMonth={params.startDate.toDate()}
            selected={{
              from: params.startDate.toDate(),
              to: params.endDate.toDate(),
            }}
            onSelect={(range) => {
              if (range && range.from && range.to) {
                setProp("startDate")(new DayDate(range.from));
                setProp("endDate")(new DayDate(range.to));
              }
            }}
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
              checked={params.respectLeaveSchedule}
              onChange={setProp("respectLeaveSchedule")}
            />
            <div>
              <div className="flex items-center">
                <LabeledSwitch
                  label="Require a maximum interval between shifts for each worker (in days)"
                  checked={params.requireMaximumIntervalBetweenShifts}
                  onChange={setProp("requireMaximumIntervalBetweenShifts")}
                />
                {params.requireMaximumIntervalBetweenShifts && (
                  <input
                    type="number"
                    value={params.maximumIntervalBetweenShifts}
                    min={1}
                    className="w-16 text-right"
                    disabled={!params.requireMaximumIntervalBetweenShifts}
                    onChange={(e) =>
                      setProp("maximumIntervalBetweenShifts")(
                        parseInt(e.target.value)
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <LabeledSwitch
                  label="Require a minimum number of shifts in a standard workday for each worker each week"
                  checked={
                    params.requireMinimumNumberOfShiftsPerWeekInStandardWorkday
                  }
                  onChange={setProp(
                    "requireMinimumNumberOfShiftsPerWeekInStandardWorkday"
                  )}
                />
                {params.requireMinimumNumberOfShiftsPerWeekInStandardWorkday && (
                  <input
                    type="number"
                    value={params.minimumNumberOfShiftsPerWeekInStandardWorkday}
                    min={1}
                    className="w-16 text-right"
                    disabled={
                      !params.requireMinimumNumberOfShiftsPerWeekInStandardWorkday
                    }
                    onChange={(e) =>
                      setProp("minimumNumberOfShiftsPerWeekInStandardWorkday")(
                        parseInt(e.target.value)
                      )
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
                  value={params.workerInconvenienceEquality}
                  onChange={setProp("workerInconvenienceEquality")}
                />
                <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
                  {params.workerInconvenienceEquality}%
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
                value={params.workerSlotEquality}
                onChange={setProp("workerSlotEquality")}
              />
              <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
                {params.workerSlotEquality}%
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
                Higher values try to equalize the spread of shifts for each
                worker through time
              </p>
              <RangeSlider
                min={0}
                max={100}
                value={params.workerSlotProximity}
                onChange={setProp("workerSlotProximity")}
              />
              <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
                {params.workerSlotProximity}%
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};
