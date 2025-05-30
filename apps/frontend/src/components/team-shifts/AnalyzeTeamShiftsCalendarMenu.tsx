import { Trans } from "@lingui/react/macro";
import { LabeledSwitch } from "../particles/LabeledSwitch";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export interface AnalyzeTeamShiftsCalendarMenuProps {
  analyzeLeaveConflicts: boolean;
  setAnalyzeLeaveConflicts: (analyzeLeaveConflicts: boolean) => void;
  requireMaximumIntervalBetweenShifts: boolean;
  setRequireMaximumIntervalBetweenShifts: (
    requireMaximumIntervalBetweenShifts: boolean
  ) => void;
  maximumIntervalBetweenShiftsInDays: number;
  setMaximumIntervalBetweenShiftsInDays: (
    maximumIntervalBetweenShiftsInDays: number
  ) => void;
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean;
  setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday: (
    requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean
  ) => void;
  minimumNumberOfShiftsPerWeekInStandardWorkday: number;
  setMinimumNumberOfShiftsPerWeekInStandardWorkday: (
    minimumNumberOfShiftsPerWeekInStandardWorkday: number
  ) => void;
  requireMinimumRestSlotsAfterShift: boolean;
  setRequireMinimumRestSlotsAfterShift: (
    requireMinimumRestSlotsAfterShift: boolean
  ) => void;
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
  setMinimumRestSlotsAfterShift: (
    minimumRestSlotsAfterShift: {
      inconvenienceLessOrEqualThan: number;
      minimumRestMinutes: number;
    }[]
  ) => void;
}

export const AnalyzeTeamShiftsCalendarMenu = ({
  analyzeLeaveConflicts,
  setAnalyzeLeaveConflicts,
  requireMaximumIntervalBetweenShifts,
  setRequireMaximumIntervalBetweenShifts,
  maximumIntervalBetweenShiftsInDays,
  setMaximumIntervalBetweenShiftsInDays,
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday,
  setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday,
  minimumNumberOfShiftsPerWeekInStandardWorkday,
  setMinimumNumberOfShiftsPerWeekInStandardWorkday,
  requireMinimumRestSlotsAfterShift,
  setRequireMinimumRestSlotsAfterShift,
  minimumRestSlotsAfterShift,
  setMinimumRestSlotsAfterShift,
}: AnalyzeTeamShiftsCalendarMenuProps) => {
  return (
    <div className="flex flex-col gap-2">
      <LabeledSwitch
        label={<Trans>Show leave conflicts</Trans>}
        checked={analyzeLeaveConflicts}
        onChange={setAnalyzeLeaveConflicts}
      />
      <div className="flex items-center">
        <LabeledSwitch
          label={
            <Trans>
              Require a maximum interval between shifts for each worker (in
              days)
            </Trans>
          }
          checked={requireMaximumIntervalBetweenShifts}
          onChange={setRequireMaximumIntervalBetweenShifts}
        />
        {requireMaximumIntervalBetweenShifts && (
          <input
            type="number"
            value={maximumIntervalBetweenShiftsInDays}
            min={1}
            className="w-16 text-center"
            disabled={!requireMaximumIntervalBetweenShifts}
            onChange={(e) =>
              setMaximumIntervalBetweenShiftsInDays(parseInt(e.target.value))
            }
          />
        )}
      </div>
      <div className="flex items-center">
        <LabeledSwitch
          label={
            <Trans>
              Require a minimum number of shifts in a standard workday for each
              worker each week
            </Trans>
          }
          checked={requireMinimumNumberOfShiftsPerWeekInStandardWorkday}
          onChange={setRequireMinimumNumberOfShiftsPerWeekInStandardWorkday}
        />
        {requireMinimumNumberOfShiftsPerWeekInStandardWorkday && (
          <input
            type="number"
            value={minimumNumberOfShiftsPerWeekInStandardWorkday}
            min={1}
            className="w-16 text-center"
            disabled={!requireMinimumNumberOfShiftsPerWeekInStandardWorkday}
            onChange={(e) =>
              setMinimumNumberOfShiftsPerWeekInStandardWorkday(
                parseInt(e.target.value)
              )
            }
          />
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
              checked={requireMinimumRestSlotsAfterShift}
              onChange={(newValue) => {
                setRequireMinimumRestSlotsAfterShift(newValue);
                if (newValue && minimumRestSlotsAfterShift.length === 0) {
                  setMinimumRestSlotsAfterShift([
                    {
                      inconvenienceLessOrEqualThan: 50,
                      minimumRestMinutes: 480,
                    },
                  ]);
                }
              }}
            />
          </div>

          {requireMinimumRestSlotsAfterShift &&
            minimumRestSlotsAfterShift &&
            minimumRestSlotsAfterShift.length > 0 && (
              <div className="ml-8 space-y-4">
                {minimumRestSlotsAfterShift.map((rule, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        <Trans>For shifts with inconvenience score ≤</Trans>
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rule.inconvenienceLessOrEqualThan}
                        onChange={(e) => {
                          const newRules = [...minimumRestSlotsAfterShift];
                          newRules[index] = {
                            ...rule,
                            inconvenienceLessOrEqualThan: parseInt(
                              e.target.value
                            ),
                          };
                          setMinimumRestSlotsAfterShift(newRules);
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
                          const newRules = [...minimumRestSlotsAfterShift];
                          newRules[index] = {
                            ...rule,
                            minimumRestMinutes: parseInt(e.target.value) * 60,
                          };
                          setMinimumRestSlotsAfterShift(newRules);
                        }}
                        className="w-16 text-center"
                      />
                      <span className="text-sm text-gray-600">
                        <Trans>hours rest</Trans>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const newRules = minimumRestSlotsAfterShift.filter(
                          (_, i) => i !== index
                        );
                        setMinimumRestSlotsAfterShift(newRules);
                      }}
                      className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-red-600 hover:bg-red-800 text-white"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setMinimumRestSlotsAfterShift([
                      ...minimumRestSlotsAfterShift,
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
  );
};
