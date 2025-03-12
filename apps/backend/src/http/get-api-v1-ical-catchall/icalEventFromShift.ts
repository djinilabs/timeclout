import { database, type ShiftPositionsRecord } from "@/tables";
import { resourceRef } from "@/utils";
import { ICalEventData } from "ical-generator";

const startDate = (shift: ShiftPositionsRecord) => {
  const start = new Date(shift.day);
  const firstSchedule = shift.schedules[0];
  if (!firstSchedule) {
    return undefined;
  }
  const [hour, minute] = firstSchedule.startHourMinutes;
  start.setHours(hour);
  start.setMinutes(minute);
  return start;
};

const endDate = (shift: ShiftPositionsRecord) => {
  const start = new Date(shift.day);
  const lastSchedule = shift.schedules[shift.schedules.length - 1];
  if (!lastSchedule) {
    return undefined;
  }
  const [hour, minute] = lastSchedule.endHourMinutes;
  start.setHours(hour);
  start.setMinutes(minute);
  return start;
};

export const icalEventFromShift = async (
  shift: ShiftPositionsRecord
): Promise<ICalEventData | undefined> => {
  const start = startDate(shift);
  const end = endDate(shift);
  if (!start || !end) {
    return undefined;
  }
  const { entity } = await database();
  const user =
    shift.assignedTo &&
    (await entity.get(resourceRef("users", shift.assignedTo)));
  return {
    start,
    end,
    summary: (user ? user.name + " - " : "") + shift.name,
    description: shift.name,
  };
};
