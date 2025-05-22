import { FC, memo, useMemo } from "react";
import { toMinutes } from "../../utils/toMinutes";

export interface TimeSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

export interface TimeScheduleVisualizerProps {
  schedules: TimeSchedule[];
}

const getPercentageOfDays = (schedules: TimeSchedule[]) => {
  const finalHour =
    toMinutes(schedules[0]?.startHourMinutes) +
    schedules.reduce((acc, schedule) => {
      return (
        acc +
        toMinutes(schedule.endHourMinutes) -
        toMinutes(schedule.startHourMinutes)
      );
    }, 0);
  return Math.round((finalHour / 1440) * 100);
};

const getPrintableEndHour = (endHour: number) => {
  return endHour === 0 ? 24 : endHour;
};

export const MiniTimeScheduleVisualizer: FC<TimeScheduleVisualizerProps> = memo(
  ({ schedules }) => {
    const {
      howManyDaysPercentage,
      startPercent,
      totalMinutes,
      totalInconvenience,
    } = useMemo(() => {
      const howManyDaysPercentage = getPercentageOfDays(schedules);

      const startTime = toMinutes(schedules[0]?.startHourMinutes);
      const latestTime = toMinutes(
        schedules[schedules.length - 1]?.endHourMinutes
      );
      const totalMinutes = latestTime;
      const startPercent = Math.round((startTime / totalMinutes) * 100);

      const totalInconvenience = schedules.reduce(
        (acc, schedule) =>
          acc +
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

    return (
      <div
        className="items-center grid grid-cols-5"
        style={{ width: `${howManyDaysPercentage}%` }}
      >
        <div
          className="transition-all duration-300 ease-in text-[8px] text-gray-600 col-span-5 text-left whitespace-nowrap leading-none"
          style={{ marginLeft: `${startPercent}%` }}
        >
          {`${String(schedules[0].startHourMinutes[0]).padStart(2, "0")}:${String(
            schedules[0].startHourMinutes[1]
          ).padStart(2, "0")}`}
        </div>
        <div className="relative h-1 rounded-sm col-span-5">
          {schedules.map((schedule, index) => {
            const startHour = schedule.startHourMinutes[0];
            const startMinutes = schedule.startHourMinutes[1];
            const endHour = schedule.endHourMinutes[0];
            const endMinutes = schedule.endHourMinutes[1];

            const startPercent = Math.round(
              ((startHour * 60 + startMinutes) / totalMinutes) * 100
            );
            const endPercent = Math.round(
              ((endHour * 60 + endMinutes) / totalMinutes) * 100
            );
            const width = endPercent - startPercent;

            const printableEndHour = getPrintableEndHour(endHour);

            return (
              <div
                key={index}
                className="absolute h-full rounded-sm transition-all duration-300 ease-in"
                style={{
                  left: `${startPercent}%`,
                  width: `${width}%`,
                  backgroundColor: `rgb(${Math.min(255, schedule.inconveniencePerHour * 100)}, ${Math.max(0, 255 - schedule.inconveniencePerHour * 100)}, 0)`,
                }}
                title={`${String(startHour).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")} - ${String(printableEndHour).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`}
              ></div>
            );
          })}
        </div>
        <div className=" col-span-5 grid grid-cols-2">
          <div className="text-tiny text-gray-600 whitespace-nowrap text-right leading-normal">
            <span className="bg-orange-300 text-white p-1 rounded-sm">
              {totalInconvenience.toFixed(1).toLocaleString()}
            </span>
          </div>
          <div className="text-tiny text-gray-600 whitespace-nowrap text-right leading-none">
            {`${String(
              getPrintableEndHour(
                schedules[schedules.length - 1].endHourMinutes[0]
              )
            ).padStart(2, "0")}:${String(
              schedules[schedules.length - 1].endHourMinutes[1]
            ).padStart(2, "0")}`}
          </div>
        </div>
      </div>
    );
  }
);
