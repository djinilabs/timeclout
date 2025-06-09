import { FC, memo } from "react";
import { Trans } from "@lingui/react/macro";
import { TimePicker } from "../particles/TimePicker";
import { TimeScheduleVisualizer } from "./TimeScheduleVisualizer";

export interface TimeSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

export interface TimeSchedulesEditorProps {
  schedules: TimeSchedule[];
  onChange: (schedules: TimeSchedule[]) => void;
}

const ensureTimeContinuity = (schedules: TimeSchedule[]): TimeSchedule[] => {
  return schedules.map((schedule, index) => {
    if (index === 0) return schedule;

    const previousSchedule = schedules[index - 1];
    return {
      ...schedule,
      startHourMinutes: previousSchedule.endHourMinutes,
    };
  });
};

export const TimeSchedulesEditor: FC<TimeSchedulesEditorProps> = memo(
  ({ schedules, onChange }) => {
    const handleTimeChange = <
      TLabel extends
        | "startHourMinutes"
        | "endHourMinutes"
        | "inconveniencePerHour",
      TValue extends TimeSchedule[TLabel]
    >(
      index: number,
      field: TLabel,
      value: TValue
    ) => {
      const newSchedules = [...schedules];
      newSchedules[index][field] = value;
      onChange(ensureTimeContinuity(newSchedules));
    };

    return (
      <div role="region" aria-label="Time Schedules Editor">
        <TimeScheduleVisualizer schedules={schedules} />
        {schedules.map((schedule, index) => {
          return (
            <div
              className="grid grid-cols-7 gap-4 w-full"
              key={index}
              role="group"
              aria-label={`Time Schedule ${index + 1}`}
            >
              <div className="flex items-center gap-2 col-span-2">
                <label className="text-sm text-gray-600">
                  <Trans>Start</Trans>
                </label>
                <TimePicker
                  value={schedule.startHourMinutes}
                  onChange={(value) =>
                    handleTimeChange(index, "startHourMinutes", value)
                  }
                />
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <label className="text-sm text-gray-600">
                  <Trans>End</Trans>
                </label>
                <TimePicker
                  value={schedule.endHourMinutes}
                  onChange={(value) =>
                    handleTimeChange(index, "endHourMinutes", value)
                  }
                />
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <label
                  className="text-sm text-gray-600"
                  htmlFor={`inconvenience-${index}`}
                >
                  <Trans>Inconvenience</Trans>
                </label>
                <input
                  id={`inconvenience-${index}`}
                  type="number"
                  className="w-12"
                  value={schedule.inconveniencePerHour}
                  min={0}
                  required
                  step={0.1}
                  onChange={(ev) =>
                    handleTimeChange(
                      index,
                      "inconveniencePerHour",
                      Number(ev.target.value)
                    )
                  }
                  role="spinbutton"
                  aria-label={`Inconvenience per hour for schedule ${
                    index + 1
                  }`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="rounded-full h-8 w-8 flex items-center justify-center bg-teal-600 text-white hover:bg-teal-500"
                  onClick={() => {
                    const newSchedules = [...schedules];
                    newSchedules.splice(index, 1);
                    onChange(ensureTimeContinuity(newSchedules));
                  }}
                  aria-label={`Remove schedule ${index + 1}`}
                  aria-clickable
                  role="button"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="mt-4 rounded-full h-8 w-8 flex items-center justify-center bg-teal-600 text-white hover:bg-teal-500"
          onClick={() => {
            const newSchedule: TimeSchedule = {
              startHourMinutes:
                schedules.length > 0
                  ? schedules[schedules.length - 1].endHourMinutes
                  : [9, 0],
              endHourMinutes:
                schedules.length > 0
                  ? [schedules[schedules.length - 1].endHourMinutes[0] + 8, 0]
                  : [17, 0],
              inconveniencePerHour: 1,
            };
            onChange(ensureTimeContinuity([...schedules, newSchedule]));
          }}
          aria-label="Add new time schedule"
          aria-clickable
          role="button"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
      </div>
    );
  }
);
