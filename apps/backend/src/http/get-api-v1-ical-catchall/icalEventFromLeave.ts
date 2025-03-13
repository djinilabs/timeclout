import { LeaveRecord } from "@/tables";
import { ICalEventData } from "ical-generator";
import { UserCache } from "./userCache";
import { getCompoundedResourceRefConstituents, resourceRef } from "@/utils";

export const icalEventFromLeave = async (
  leave: LeaveRecord,
  users: UserCache
): Promise<ICalEventData | undefined> => {
  const userPk = resourceRef(
    "users",
    getCompoundedResourceRefConstituents(leave.pk)[1]
  );
  const user = await users.getUser(userPk);
  if (!user) {
    return undefined;
  }
  return {
    start: new Date(leave.sk),
    end: new Date(leave.sk),
    allDay: true,
    summary: `${user.name} is on [${leave.type}] leave`,
    description: `Leave from ${leave.sk} to ${leave.sk}`,
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
