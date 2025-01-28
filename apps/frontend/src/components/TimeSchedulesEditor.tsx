import { FC } from "react";
import { TimePicker } from "./TimePicker";

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

export const TimeSchedulesEditor: FC<TimeSchedulesEditorProps> = ({
  schedules,
  onChange,
}) => {
  const handleTimeChange = <
    TLabel extends
      | "startHourMinutes"
      | "endHourMinutes"
      | "inconveniencePerHour",
    TValue extends TimeSchedule[TLabel],
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
    <div>
      {schedules.map((schedule, index) => {
        return (
          <div className="flex flex-row gap-2 w-fit" key={index}>
            <div className="flex gap-2 items-center w-fit">
              <label>Start</label>
              <TimePicker
                value={schedule.startHourMinutes}
                onChange={(value) =>
                  handleTimeChange(index, "startHourMinutes", value)
                }
              />
            </div>

            <div className="flex gap-2 items-center">
              <label>End</label>
              <TimePicker
                value={schedule.endHourMinutes}
                min={schedule.startHourMinutes}
                onChange={(value) =>
                  handleTimeChange(index, "endHourMinutes", value)
                }
              />
            </div>

            <div className="flex gap-2 items-center">
              <label>Inconvenience</label>
              <input
                type="number"
                className="w-16"
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
              />
            </div>
            <button
              type="button"
              className="rounded-full h-8 w-8 flex items-center justify-center bg-teal-600 text-white hover:bg-teal-500"
              onClick={() => {
                const newSchedules = [...schedules];
                newSchedules.splice(index, 1);
                onChange(ensureTimeContinuity(newSchedules));
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
              </svg>
            </button>
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
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
      </button>
    </div>
  );
};
