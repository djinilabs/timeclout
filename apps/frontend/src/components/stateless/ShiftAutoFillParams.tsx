import { FC, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { DayDate } from "@/day-date";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { RangeSlider } from "./RangeSlider";
import { LabeledSwitch } from "./LabeledSwitch";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export interface ShiftAutoFillParamValues {
  startDate?: DayDate;
  endDate?: DayDate;
  workerInconvenienceEquality: number;
  workerSlotEquality: number;
  workerSlotProximity: number;
  respectLeaveSchedule: boolean;
  requireMaximumIntervalBetweenShifts: boolean;
  maximumIntervalBetweenShifts: number;
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean;
  minimumNumberOfShiftsPerWeekInStandardWorkday: number;
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
}

export interface ShiftAutoFillParamsProps extends ShiftAutoFillParamValues {
  onChange: (params: ShiftAutoFillParamValues) => void;
}

export const ShiftAutoFillParams: FC<ShiftAutoFillParamsProps> = ({
  onChange,
  ...params
}) => {
  const setProp = useCallback(
    <TKey extends keyof ShiftAutoFillParamValues>(key: TKey) =>
      (value: ShiftAutoFillParamValues[TKey]) => {
        onChange({
          ...params,
          [key]: value,
        });
      },
    [onChange, params]
  );

  const setPartial = useCallback(
    (newProps: Partial<ShiftAutoFillParamValues>) => {
      onChange({
        ...params,
        ...newProps,
      });
    },
    [onChange, params]
  );

  return (
    <div className="grid grid-cols-3 gap-0">
      <div className="col-span-2">
        <div className="grid grid-cols-1 gap-0">
          <h3 className="mt-5 text-base font-semibold text-gray-900">
            <Trans>Date range</Trans>
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            <Trans>
              Select the period for which you want to automatically assign
              shifts
            </Trans>
          </p>
          <DayPicker
            mode="range"
            ISOWeek
            timeZone="UTC"
            locale={{ code: i18n.locale }}
            numberOfMonths={2}
            defaultMonth={params.startDate?.toDate()}
            required
            selected={{
              from: params.startDate?.toDate(),
              to: params.endDate?.toDate(),
            }}
            onSelect={(range) => {
              setPartial({
                startDate: range?.from ? new DayDate(range.from) : undefined,
                endDate: range?.to ? new DayDate(range.to) : undefined,
              });
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-0">
          <h3 className="mt-5 text-base font-semibold text-gray-900">
            <Trans>Rules</Trans>
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            <Trans>
              Select the rules for which you want to enforce while automatically
              assign shifts
            </Trans>
          </p>
          <div className="grid grid-cols-1 gap-3">
            <LabeledSwitch
              label={<Trans>Respect leave schedule</Trans>}
              checked={params.respectLeaveSchedule}
              onChange={setProp("respectLeaveSchedule")}
            />
            <div>
              <div className="flex items-center">
                <LabeledSwitch
                  label={
                    <Trans>
                      Require a maximum interval between shifts for each worker
                      (in days)
                    </Trans>
                  }
                  checked={params.requireMaximumIntervalBetweenShifts}
                  onChange={setProp("requireMaximumIntervalBetweenShifts")}
                />
                {params.requireMaximumIntervalBetweenShifts && (
                  <input
                    type="number"
                    value={params.maximumIntervalBetweenShifts}
                    min={1}
                    className="w-16 text-center"
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
                  label={
                    <Trans>
                      Require a minimum number of shifts in a standard workday
                      for each worker each week
                    </Trans>
                  }
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
                    className="w-16 text-center"
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
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <LabeledSwitch
                    label={
                      <Trans>
                        Require minimum rest periods between shifts based on
                        inconvenience scores
                      </Trans>
                    }
                    checked={params.minimumRestSlotsAfterShift?.length > 0}
                    onChange={(checked) => {
                      if (checked) {
                        setProp("minimumRestSlotsAfterShift")([
                          {
                            inconvenienceLessOrEqualThan: 50,
                            minimumRestMinutes: 480,
                          },
                        ]);
                      } else {
                        setProp("minimumRestSlotsAfterShift")([]);
                      }
                    }}
                  />
                </div>

                {params.minimumRestSlotsAfterShift &&
                  params.minimumRestSlotsAfterShift.length > 0 && (
                    <div className="ml-8 space-y-4">
                      {params.minimumRestSlotsAfterShift.map((rule, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              <Trans>
                                For shifts with inconvenience score ≤
                              </Trans>
                            </span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={rule.inconvenienceLessOrEqualThan}
                              onChange={(e) => {
                                const newRules = [
                                  ...params.minimumRestSlotsAfterShift,
                                ];
                                newRules[index] = {
                                  ...rule,
                                  inconvenienceLessOrEqualThan: parseInt(
                                    e.target.value
                                  ),
                                };
                                setProp("minimumRestSlotsAfterShift")(newRules);
                              }}
                              className="w-16 text-center"
                            />
                            <span className="text-sm text-gray-600">
                              <Trans>require</Trans>
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={rule.minimumRestMinutes / 60}
                              onChange={(e) => {
                                const newRules = [
                                  ...params.minimumRestSlotsAfterShift,
                                ];
                                newRules[index] = {
                                  ...rule,
                                  minimumRestMinutes:
                                    parseInt(e.target.value) * 60,
                                };
                                setProp("minimumRestSlotsAfterShift")(newRules);
                              }}
                              className="w-16 text-center"
                            />
                            <span className="text-sm text-gray-600">
                              <Trans>hours rest</Trans>
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const newRules =
                                params.minimumRestSlotsAfterShift.filter(
                                  (_, i) => i !== index
                                );
                              setProp("minimumRestSlotsAfterShift")(newRules);
                            }}
                            className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-red-600 hover:bg-red-800 text-white"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setProp("minimumRestSlotsAfterShift")([
                            ...params.minimumRestSlotsAfterShift,
                            {
                              inconvenienceLessOrEqualThan: 50,
                              minimumRestMinutes: 480,
                            },
                          ]);
                        }}
                        className="text-white"
                      >
                        <span className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-teal-600 hover:bg-teal-800 leading-none">
                          <PlusIcon className="w-4 h-4" />
                        </span>
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mt-5 text-base font-semibold text-gray-900">
          <Trans>Fine-tune parameters</Trans>
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          <Trans>
            Adjust these parameters to control how the automatic assignment
            balances different priorities
          </Trans>
        </p>
        <dl className="mt-5 grid grid-cols-1 gap-5">
          <div>
            <div
              key="worker-inconvenience-equality"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                <Trans>Worker Inconvenience Equality</Trans>
              </dt>
              <p className="text-sm text-gray-400 mt-1">
                <Trans>
                  Higher values ensure workers get similar levels of
                  inconvenient shifts (nights, weekends)
                </Trans>
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
                <Trans>Worker Shift Equality</Trans>
              </dt>
              <p className="text-sm text-gray-400 mt-1">
                <Trans>
                  Higher values ensure workers get a more equal distribution of
                  total shifts
                </Trans>
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
                <Trans>Worker Shift Proximity</Trans>
              </dt>
              <p className="text-sm text-gray-400 mt-1">
                <Trans>
                  Higher values try to equalize the spread of shifts for each
                  worker through time
                </Trans>
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
