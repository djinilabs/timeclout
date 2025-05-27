import { DayDate } from "@/day-date";
import type { ShiftPosition } from "libs/graphql/src/types.generated";
import type { TimeSchedule } from "../components/types";
import { toMinutes } from "./toMinutes";

const minutesInDay = 24 * 60;

const splitSchedule = <T extends Pick<ShiftPosition, "day" | "schedules">>(
  acc: T[],
  shiftPosition: T,
  schedule: TimeSchedule
): T[] => {
  const firstDay = new DayDate(shiftPosition.day);
  const startMinutes = toMinutes(schedule.startHourMinutes);
  const startDayIndex = Math.floor(startMinutes / minutesInDay);
  while (acc.length <= startDayIndex) {
    acc.push({
      ...shiftPosition,
      day: firstDay.nextDay(acc.length).toString(),
      schedules: [],
    });
  }

  const thisDayStartMinutes = startMinutes - startDayIndex * minutesInDay;
  const endMinutes = toMinutes(schedule.endHourMinutes);
  const dayRelativeEndMinutes = endMinutes - startDayIndex * minutesInDay;
  const thisDayEndMinutes = Math.min(dayRelativeEndMinutes, minutesInDay);

  const currentDay = acc[startDayIndex];

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
    acc = acc.concat(
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
  return acc;
};

export const splitShiftPositionForEachDay = <
  T extends Pick<ShiftPosition, "day" | "schedules">,
>(
  shiftPosition: T
): T[] => {
  const schedules = shiftPosition.schedules as Array<TimeSchedule>;

  return schedules.reduce<T[]>((acc, schedule) => {
    return splitSchedule(acc, shiftPosition, schedule);
  }, []);
};
