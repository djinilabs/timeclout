import type { ShiftPosition } from "libs/graphql/src/types.generated";

import type { TimeSchedule } from "../components/types";

import { toMinutes } from "./toMinutes";

import { DayDate } from "@/day-date";

const minutesInDay = 24 * 60;

const splitSchedule = <T extends Pick<ShiftPosition, "day" | "schedules">>(
  accumulator: T[],
  shiftPosition: T,
  schedule: TimeSchedule
): T[] => {
  const firstDay = new DayDate(shiftPosition.day);
  const startMinutes = toMinutes(schedule.startHourMinutes);
  const startDayIndex = Math.floor(startMinutes / minutesInDay);
  while (accumulator.length <= startDayIndex) {
    accumulator.push({
      ...shiftPosition,
      day: firstDay.nextDay(accumulator.length).toString(),
      schedules: [],
    });
  }

  const thisDayStartMinutes = startMinutes - startDayIndex * minutesInDay;
  const endMinutes = toMinutes(schedule.endHourMinutes);
  const dayRelativeEndMinutes = endMinutes - startDayIndex * minutesInDay;
  const thisDayEndMinutes = Math.min(dayRelativeEndMinutes, minutesInDay);

  const currentDay = accumulator[startDayIndex];

  currentDay.schedules.push({
    ...schedule,
    startHourMinutes: [
      Math.floor(thisDayStartMinutes / 60),
      thisDayStartMinutes % 60,
    ],
    endHourMinutes: [
      Math.floor(thisDayEndMinutes / 60),
      thisDayEndMinutes % 60,
    ],
  });

  if (dayRelativeEndMinutes > minutesInDay) {
    accumulator = accumulator.concat(
      splitSchedule(
        [],
        {
          ...shiftPosition,
          day: firstDay.nextDay(startDayIndex + 1).toString(),
          schedules: [],
        },
        {
          ...schedule,
          startHourMinutes: [0, 0],
          endHourMinutes: [
            Math.floor(dayRelativeEndMinutes / 60) - 24,
            dayRelativeEndMinutes % 60,
          ],
        }
      )
    );
  }
  return accumulator;
};

export const splitShiftPositionForEachDay = <
  T extends Pick<ShiftPosition, "day" | "schedules">,
>(
  shiftPosition: T
): T[] => {
  const schedules = shiftPosition.schedules as Array<TimeSchedule>;

  return schedules.reduce<T[]>((accumulator, schedule) => {
    return splitSchedule(accumulator, shiftPosition, schedule);
  }, []);
};
