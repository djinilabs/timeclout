import { database } from "@/tables";
import ical, { ICalCalendarMethod } from "ical-generator";
import { icalEventFromShift } from "./icalEventFromShift";
import { DayDate } from "@/day-date";
import { resourceRef } from "@/utils";
import { notFound } from "@hapi/boom";

export const getTeamShiftsIcal = async (teamId: string): Promise<string> => {
  const { entity, shift_positions } = await database();

  const team = await entity.get(resourceRef("teams", teamId));

  if (!team) {
    throw notFound("Team not found");
  }

  const calendar = ical({
    name: `${team.name} Shifts`,
    method: ICalCalendarMethod.PUBLISH,
  });

  const oneMonthAgo = new DayDate(new Date()).previousMonth();
  const oneYearFromNow = new DayDate(new Date()).nextYear();

  const shifts = await shift_positions.query({
    KeyConditionExpression: "pk = :pk and sk between :start and :end",
    ExpressionAttributeValues: {
      ":pk": `teams/${teamId}`,
      ":start": oneMonthAgo.toString(),
      ":end": oneYearFromNow.toString(),
    },
  });

  for (const shift of shifts) {
    calendar.createEvent(await icalEventFromShift(shift));
  }

  return calendar.toString();
};
