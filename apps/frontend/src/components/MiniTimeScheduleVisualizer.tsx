import { FC } from "react";

export interface TimeSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

export interface TimeScheduleVisualizerProps {
  schedules: TimeSchedule[];
}

const toMinutes = ([hours, minutes]: [number, number]) => {
  return hours * 60 + minutes;
};

const getPercentageOfDays = (schedules: TimeSchedule[]) => {
  const finalHour =
    toMinutes(schedules[0].startHourMinutes) +
    schedules.reduce((acc, schedule) => {
      return (
        acc +
        toMinutes(schedule.endHourMinutes) -
        toMinutes(schedule.startHourMinutes)
      );
    }, 0);
  return Math.round((finalHour / 1440) * 100);
};

export const MiniTimeScheduleVisualizer: FC<TimeScheduleVisualizerProps> = ({
  schedules,
}) => {
  if (schedules.length === 0) {
    return null;
  }
  const howManyDaysPercentage = getPercentageOfDays(schedules);

  return (
    <div
      className="items-center grid grid-cols-5 z-[1000]"
      style={{ width: `${howManyDaysPercentage}%` }}
    >
      <div className="text-[8px] text-gray-600 col-span-5 text-left">
        {schedules.length > 0
          ? `${String(schedules[0].startHourMinutes[0]).padStart(2, "0")}:${String(
              schedules[0].startHourMinutes[1]
            ).padStart(2, "0")}`
          : "00:00"}
      </div>
      <div className="relative h-1 bg-gray-200 rounded col-span-5">
        {schedules.map((schedule, index) => {
          const startHour = schedule.startHourMinutes[0];
          const startMinutes = schedule.startHourMinutes[1];
          const endHour = schedule.endHourMinutes[0];
          const endMinutes = schedule.endHourMinutes[1];

          const earliestTime = toMinutes(schedules[0].startHourMinutes);
          const latestTime = toMinutes(
            schedules[schedules.length - 1].endHourMinutes
          );
          const totalMinutes = latestTime - earliestTime;

          const startPercent =
            ((startHour * 60 + startMinutes - earliestTime) / totalMinutes) *
            100;
          const endPercent =
            ((endHour * 60 + endMinutes - earliestTime) / totalMinutes) * 100;
          const width = endPercent - startPercent;

          return (
            <div
              key={index}
              className="absolute h-full rounded group"
              style={{
                left: `${startPercent}%`,
                width: `${width}%`,
                backgroundColor: `rgb(${Math.min(255, schedule.inconveniencePerHour * 100)}, ${Math.max(0, 255 - schedule.inconveniencePerHour * 100)}, 0)`,
              }}
            >
              <div className="absolute bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1">
                {`${String(startHour % 24).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}${startHour >= 24 ? " next day" : ""} - ${String(endHour % 24).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}${endHour >= 24 ? " next day" : ""}`}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-tiny text-gray-600 whitespace-nowrap col-span-5 text-right z-[1000]">
        {schedules.length > 0
          ? `${String(
              schedules[schedules.length - 1].endHourMinutes[0] % 24
            ).padStart(2, "0")}:${String(
              schedules[schedules.length - 1].endHourMinutes[1]
            ).padStart(2, "0")}${
              schedules[schedules.length - 1].endHourMinutes[0] >= 24
                ? " next day"
                : ""
            }`
          : "24:00"}
      </div>
    </div>
  );
};
