import { FC } from "react";

export interface TimeSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

export interface TimeScheduleVisualizerProps {
  schedules: TimeSchedule[];
}

export const TimeScheduleVisualizer: FC<TimeScheduleVisualizerProps> = ({
  schedules,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-600 w-24">
        {schedules.length > 0
          ? `${String(schedules[0].startHourMinutes[0]).padStart(2, "0")}:${String(
              schedules[0].startHourMinutes[1]
            ).padStart(2, "0")}`
          : "00:00"}
      </div>
      <div className="relative flex-1 h-2 bg-gray-200 rounded">
        {schedules.map((schedule, index) => {
          const startHour = schedule.startHourMinutes[0];
          const startMinutes = schedule.startHourMinutes[1];
          const endHour = schedule.endHourMinutes[0];
          const endMinutes = schedule.endHourMinutes[1];

          const earliestTime =
            schedules[0].startHourMinutes[0] * 60 +
            schedules[0].startHourMinutes[1];
          const latestTime =
            schedules[schedules.length - 1].endHourMinutes[0] * 60 +
            schedules[schedules.length - 1].endHourMinutes[1];
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
      <div className="text-sm text-gray-600 w-24 text-right whitespace-nowrap">
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
