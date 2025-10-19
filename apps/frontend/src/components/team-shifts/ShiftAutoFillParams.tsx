import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { FC, useCallback, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  CompanySettingsArgs,
  Query,
  QueryCompanyArgs,
} from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { DayPicker } from "../atoms/DayPicker";
import { LabeledSwitch } from "../particles/LabeledSwitch";
import { RangeSlider } from "../particles/RangeSlider";

import { DayDate } from "@/day-date";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { leaveTypeParser } from "@/settings";
import { getDefined } from "@/utils";

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
  requireFirstShiftAfterExtendedLeave: boolean;
  firstShiftAfterExtendedLeaveMinimumDays: number;
  firstShiftAfterExtendedLeaveApplicableTypes: string[];
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
  const { company } = useParams();

  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(company, "No company provided"),
      name: "leaveTypes",
    },
  });

  const leaveTypes = useMemo(() => {
    const company = companyWithSettingsQueryResponse?.data?.company;
    return company?.settings ? leaveTypeParser.parse(company.settings) : [];
  }, [companyWithSettingsQueryResponse]);

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

  // Ensure default values are set when the rule is enabled
  useEffect(() => {
    if (params.requireFirstShiftAfterExtendedLeave) {
      if (params.firstShiftAfterExtendedLeaveMinimumDays === undefined) {
        setProp("firstShiftAfterExtendedLeaveMinimumDays")(3);
      }
      if (params.firstShiftAfterExtendedLeaveApplicableTypes === undefined) {
        setProp("firstShiftAfterExtendedLeaveApplicableTypes")([]);
      }
    }
  }, [
    params.requireFirstShiftAfterExtendedLeave,
    params.firstShiftAfterExtendedLeaveMinimumDays,
    params.firstShiftAfterExtendedLeaveApplicableTypes,
    setProp,
  ]);

  return (
    <div
      className="grid grid-cols-3 gap-0"
      role="form"
      aria-label="Shift auto-fill parameters"
    >
      <div className="col-span-2">
        <div className="grid grid-cols-1 gap-0">
          <h3
            className="mt-5 text-base font-semibold text-gray-900"
            id="date-range-heading"
          >
            <Trans>Date range</Trans>
          </h3>
          <p className="text-sm text-gray-400 mb-4" id="date-range-description">
            <Trans>
              Select the period for which you want to automatically assign
              shifts
            </Trans>
          </p>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            defaultMonth={params.startDate?.toDate()}
            required
            selected={{
              from: params.startDate?.toDate(),
              to: params.endDate?.toDate(),
            }}
            onSelectRange={(range) => {
              setPartial({
                startDate: range?.from ? new DayDate(range.from) : undefined,
                endDate: range?.to ? new DayDate(range.to) : undefined,
              });
            }}
            aria-labelledby="date-range-heading"
            aria-describedby="date-range-description"
          />
        </div>
        <div className="grid grid-cols-1 gap-0">
          <h3
            className="mt-5 text-base font-semibold text-gray-900"
            id="rules-heading"
          >
            <Trans>Rules</Trans>
          </h3>
          <p className="text-sm text-gray-400 mb-4" id="rules-description">
            <Trans>
              Select the rules for which you want to enforce while automatically
              assign shifts
            </Trans>
          </p>
          <div
            className="grid grid-cols-1 gap-3"
            role="group"
            aria-labelledby="rules-heading"
            aria-describedby="rules-description"
          >
            <LabeledSwitch
              label={<Trans>Respect leave schedule</Trans>}
              checked={params.respectLeaveSchedule}
              onChange={setProp("respectLeaveSchedule")}
              aria-label="Respect leave schedule"
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
                  aria-label="Require maximum interval between shifts"
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
                    aria-label="Maximum interval between shifts in days"
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
                  aria-label="Require minimum number of shifts per week"
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
                    aria-label="Minimum number of shifts per week"
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
                        Require workers to be scheduled on their first shift
                        after returning from extended leave
                      </Trans>
                    }
                    checked={params.requireFirstShiftAfterExtendedLeave}
                    onChange={setProp("requireFirstShiftAfterExtendedLeave")}
                    aria-label="Require first shift after extended leave"
                  />
                </div>
                {params.requireFirstShiftAfterExtendedLeave && (
                  <div className="ml-8 flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      <Trans>Minimum continuous days:</Trans>
                    </span>
                    <input
                      type="number"
                      value={
                        params.firstShiftAfterExtendedLeaveMinimumDays ?? 3
                      }
                      min={1}
                      className="w-16 text-center"
                      onChange={(e) =>
                        setProp("firstShiftAfterExtendedLeaveMinimumDays")(
                          parseInt(e.target.value) || 3
                        )
                      }
                      onBlur={(e) => {
                        // Ensure we have a valid value when the input loses focus
                        const value = parseInt(e.target.value) || 3;
                        if (
                          params.firstShiftAfterExtendedLeaveMinimumDays !==
                          value
                        ) {
                          setProp("firstShiftAfterExtendedLeaveMinimumDays")(
                            value
                          );
                        }
                      }}
                      aria-label="Minimum continuous days on leave"
                    />
                  </div>
                )}
              </div>
              {params.requireFirstShiftAfterExtendedLeave && (
                <div className="ml-8 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      <Trans>Applicable leave types:</Trans>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {leaveTypes.map((leaveType) => (
                        <label
                          key={leaveType.name}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={
                              params.firstShiftAfterExtendedLeaveApplicableTypes?.includes(
                                leaveType.name
                              ) ?? false
                            }
                            onChange={(e) => {
                              const currentTypes =
                                params.firstShiftAfterExtendedLeaveApplicableTypes ??
                                [];
                              if (e.target.checked) {
                                setProp(
                                  "firstShiftAfterExtendedLeaveApplicableTypes"
                                )([...currentTypes, leaveType.name]);
                              } else {
                                setProp(
                                  "firstShiftAfterExtendedLeaveApplicableTypes"
                                )(
                                  currentTypes.filter(
                                    (type) => type !== leaveType.name
                                  )
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">
                            {leaveType.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                    aria-label="Require minimum rest periods between shifts"
                  />
                </div>

                {params.minimumRestSlotsAfterShift &&
                  params.minimumRestSlotsAfterShift.length > 0 && (
                    <div
                      className="ml-8 space-y-4"
                      role="group"
                      aria-label="Rest period rules"
                    >
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
                              aria-label={`Inconvenience score threshold for rule ${
                                index + 1
                              }`}
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
                              aria-label={`Minimum rest hours for rule ${
                                index + 1
                              }`}
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
                            aria-label={`Remove rest period rule ${index + 1}`}
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
                        aria-label="Add new rest period rule"
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
        <h3
          className="mt-5 text-base font-semibold text-gray-900"
          id="fine-tune-heading"
        >
          <Trans>Fine-tune parameters</Trans>
        </h3>
        <p className="text-sm text-gray-400 mb-4" id="fine-tune-description">
          <Trans>
            Adjust these parameters to control how the automatic assignment
            balances different priorities
          </Trans>
        </p>
        <dl
          className="mt-5 grid grid-cols-1 gap-5"
          role="group"
          aria-labelledby="fine-tune-heading"
          aria-describedby="fine-tune-description"
        >
          <div>
            <div
              key="worker-inconvenience-equality"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
            >
              <dt
                className="truncate text-sm font-medium text-gray-500"
                id="inconvenience-equality-label"
              >
                <Trans>Worker Inconvenience Equality</Trans>
              </dt>
              <p
                className="text-sm text-gray-400 mt-1"
                id="inconvenience-equality-description"
              >
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
                  aria-labelledby="inconvenience-equality-label"
                  aria-describedby="inconvenience-equality-description"
                />
                <div
                  className="text-3xl font-semibold tracking-tight text-gray-900 text-right"
                  aria-live="polite"
                >
                  {params.workerInconvenienceEquality}%
                </div>
              </dd>
            </div>
          </div>
          <div>
            <div
              key="worker-slot-equality"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
            >
              <dt
                className="truncate text-sm font-medium text-gray-500"
                id="slot-equality-label"
              >
                <Trans>Worker Shift Equality</Trans>
              </dt>
              <p
                className="text-sm text-gray-400 mt-1"
                id="slot-equality-description"
              >
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
                aria-labelledby="slot-equality-label"
                aria-describedby="slot-equality-description"
              />
              <div
                className="text-3xl font-semibold tracking-tight text-gray-900 text-right"
                aria-live="polite"
              >
                {params.workerSlotEquality}%
              </div>
            </div>
          </div>
          <div>
            <div
              key="worker-slot-proximity"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
            >
              <dt
                className="truncate text-sm font-medium text-gray-500"
                id="slot-proximity-label"
              >
                <Trans>Worker Shift Proximity</Trans>
              </dt>
              <p
                className="text-sm text-gray-400 mt-1"
                id="slot-proximity-description"
              >
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
                aria-labelledby="slot-proximity-label"
                aria-describedby="slot-proximity-description"
              />
              <div
                className="text-3xl font-semibold tracking-tight text-gray-900 text-right"
                aria-live="polite"
              >
                {params.workerSlotProximity}%
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};
