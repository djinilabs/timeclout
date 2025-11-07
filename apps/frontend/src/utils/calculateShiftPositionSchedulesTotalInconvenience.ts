import { ShiftPositionSchedule } from "../graphql/graphql";

export const calculateShiftPositionSchedulesTotalInconvenience = (
  schedules: ShiftPositionSchedule[]
) => {
  return schedules.reduce((acc, schedule) => {
    return (
      acc +
      schedule.inconveniencePerHour *
        (schedule.endHourMinutes[0] +
          schedule.endHourMinutes[1] / 60 -
          (schedule.startHourMinutes[0] + schedule.startHourMinutes[1] / 60))
    );
  }, 0);
};
