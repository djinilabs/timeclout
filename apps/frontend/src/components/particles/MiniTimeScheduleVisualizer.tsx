import { FC, memo, useMemo } from "react";

import { classNames } from "../../utils/classNames";
import { toMinutes } from "../../utils/toMinutes";

import { Hint } from "./Hint";

export interface TimeSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

const getPercentageOfDays = (schedules: TimeSchedule[]) => {
  const finalHour =
    toMinutes(schedules[0]?.startHourMinutes) +
    schedules.reduce((accumulator, schedule) => {
      return (
        accumulator +
        toMinutes(schedule.endHourMinutes) -
        toMinutes(schedule.startHourMinutes)
      );
    }, 0);
  return Math.round((finalHour / 1440) * 100);
};

const getPrintableEndHour = (endHour: number) => {
  return endHour === 0 ? 24 : endHour;
};

interface ScheduleBarProperties {
  schedules: TimeSchedule[];
  totalMinutes: number;
  marginLeftAccordingToSchedule?: boolean;
}

const ScheduleBar: FC<ScheduleBarProperties> = ({
  schedules,
  totalMinutes,
  marginLeftAccordingToSchedule = true,
}) => {
  const firstSchedule = schedules[0];
  const startSkewInPercent = marginLeftAccordingToSchedule
    ? 0
    : Math.round(
        (toMinutes(firstSchedule.startHourMinutes) / totalMinutes) * 100
      );
  return (
    <div
      className="relative h-1 rounded-sm col-span-5"
      role="list"
      aria-label="Time schedule segments"
    >
      {schedules.map((schedule, index) => {
        const start = schedule.startHourMinutes;
        const end = schedule.endHourMinutes;

        const startPercent =
          Math.round((toMinutes(start) / totalMinutes) * 100) -
          startSkewInPercent;
        const endPercent =
          Math.round((toMinutes(end) / totalMinutes) * 100) -
          startSkewInPercent;
        const width = endPercent - startPercent;

        const printableEndHour = getPrintableEndHour(end[0]);

        return (
          <Hint
            key={index}
            hint={`${String(start[0]).padStart(2, "0")}:${String(
              start[1]
            ).padStart(2, "0")} - ${String(printableEndHour).padStart(
              2,
              "0"
            )}:${String(end[1]).padStart(2, "0")}`}
            className="absolute h-full rounded-sm transition-all duration-300 ease-in"
            style={{
              left: `${startPercent}%`,
              width: `${width}%`,
              backgroundColor: `rgb(${Math.min(
                255,
                schedule.inconveniencePerHour * 100
              )}, ${Math.max(
                0,
                255 - schedule.inconveniencePerHour * 100
              )}, 0)`,
            }}
            aria-label={`Time segment from ${String(start[0]).padStart(
              2,
              "0"
            )}:${String(start[1]).padStart(2, "0")} to ${String(
              printableEndHour
            ).padStart(2, "0")}:${String(end[1]).padStart(
              2,
              "0"
            )} with inconvenience level ${schedule.inconveniencePerHour}`}
          ></Hint>
        );
      })}
    </div>
  );
};

ScheduleBar.displayName = "ScheduleBar";

export interface TimeScheduleVisualizerProperties {
  schedules: TimeSchedule[];
  marginLeftAccordingToSchedule?: boolean;
}

export const MiniTimeScheduleVisualizer: FC<TimeScheduleVisualizerProperties> = memo(
  function MiniTimeScheduleVisualizer({
    schedules,
    marginLeftAccordingToSchedule = true,
  }) {
    const {
      howManyDaysPercentage,
      startPercent,
      totalMinutes,
      totalInconvenience,
    } = useMemo(() => {
      const howManyDaysPercentage = getPercentageOfDays(schedules);

      const startTime = toMinutes(schedules[0]?.startHourMinutes);
      const latestTime = toMinutes(
        schedules.at(-1)?.endHourMinutes
      );
      const totalMinutes = latestTime;
      const startPercent = Math.round((startTime / totalMinutes) * 100);

      const totalInconvenience = schedules.reduce(
        (accumulator, schedule) =>
          accumulator +
          schedule.inconveniencePerHour *
            (schedule.endHourMinutes[0] +
              schedule.endHourMinutes[1] / 60 -
              (schedule.startHourMinutes[0] +
                schedule.startHourMinutes[1] / 60)),
        0
      );

      return {
        howManyDaysPercentage,
        startPercent,
        totalMinutes,
        totalInconvenience,
      };
    }, [schedules]);

    if (schedules.length === 0) {
      return null;
    }

    const firstSchedule = schedules[0];
    const lastSchedule = schedules.at(-1);

    return (
      <div
        className="items-center grid grid-cols-5"
        style={{ width: `${howManyDaysPercentage}%` }}
        role="region"
        aria-label="Time schedule visualization"
      >
        <div
          className="transition-all duration-300 ease-in text-[8px] text-gray-600 col-span-5 text-left whitespace-nowrap leading-none"
          style={{
            marginLeft: marginLeftAccordingToSchedule
              ? `${startPercent}%`
              : undefined,
          }}
          aria-label={`Schedule starts at ${String(
            firstSchedule.startHourMinutes[0]
          ).padStart(2, "0")}:${String(
            firstSchedule.startHourMinutes[1]
          ).padStart(2, "0")}`}
        >
          {`${String(firstSchedule.startHourMinutes[0]).padStart(
            2,
            "0"
          )}:${String(firstSchedule.startHourMinutes[1]).padStart(2, "0")}`}
        </div>

        <ScheduleBar
          schedules={schedules}
          totalMinutes={totalMinutes}
          marginLeftAccordingToSchedule={marginLeftAccordingToSchedule}
        />

        <div
          className={classNames(
            "grid grid-cols-2",
            marginLeftAccordingToSchedule ? "col-span-5" : "col-span-2"
          )}
        >
          <div className="text-tiny text-gray-600 whitespace-nowrap text-right leading-normal">
            <Hint
              as="span"
              className="bg-orange-300 text-white p-1 rounded-sm"
              hint={`${totalInconvenience
                .toFixed(1)
                .toLocaleString()} inconvenience points`}
              aria-label={`Total inconvenience: ${totalInconvenience
                .toFixed(1)
                .toLocaleString()} points`}
            >
              {totalInconvenience.toFixed(1).toLocaleString()}
            </Hint>
          </div>
          <Hint
            as="span"
            className="text-tiny text-gray-600 whitespace-nowrap text-right leading-none"
            hint={`${String(
              getPrintableEndHour(lastSchedule.endHourMinutes[0])
            ).padStart(2, "0")}:${String(
              lastSchedule.endHourMinutes[1]
            ).padStart(2, "0")}`}
            aria-label={`Schedule ends at ${String(
              getPrintableEndHour(lastSchedule.endHourMinutes[0])
            ).padStart(2, "0")}:${String(
              lastSchedule.endHourMinutes[1]
            ).padStart(2, "0")}`}
          >
            {`${String(
              getPrintableEndHour(lastSchedule.endHourMinutes[0])
            ).padStart(2, "0")}:${String(
              lastSchedule.endHourMinutes[1]
            ).padStart(2, "0")}`}
          </Hint>
        </div>
      </div>
    );
  }
);
