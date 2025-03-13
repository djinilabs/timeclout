import { database, type ShiftPositionsRecord } from "@/tables";
import { resourceRef } from "@/utils";
import { ICalEventData } from "ical-generator";
import { UserCache } from "./userCache";

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
  shift: ShiftPositionsRecord,
  users: UserCache
): Promise<ICalEventData | undefined> => {
  const start = startDate(shift);
  const end = endDate(shift);
  if (!start || !end) {
    return undefined;
  }
  const user = shift.assignedTo
    ? await users.getUser(resourceRef("users", shift.assignedTo))
    : undefined;
  if (!user) {
    return undefined;
  }

  return {
    start,
    end,
    summary: (user ? user.name + " - " : "") + shift.name,
    description: shift.name,
    organizer: user.email,
    attendees: user.email
      ? [
          {
            name: user.name,
            email: user.email,
          },
        ]
      : undefined,
  };
};
