import { getLeavesForDateRange, teamMembers } from "@/business-logic";
import { DayDate } from "@/day-date";
import { database, LeaveRecord } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
import { notFound } from "@hapi/boom";
import ical, { ICalCalendarMethod } from "ical-generator";
import { icalEventFromLeave } from "./icalEventFromLeave";
import { userCache } from "./userCache";
import { i18n } from "@/locales";

export const getTeamLeavesIcal = async (teamId: string) => {
  const { entity } = await database();

  const team = await entity.get(resourceRef("teams", teamId));

  if (!team) {
    throw notFound(i18n._("Team not found"));
  }

  const unit = await entity.get(
    resourceRef("units", getDefined(team.parentPk, "team has no unit"))
  );

  if (!unit) {
    throw notFound(i18n._("team has no unit"));
  }

  const companyPk = getDefined(unit.parentPk, "unit has no company");

  const memberRefs = await teamMembers(resourceRef("teams", team.pk));

  const today = new DayDate(new Date());
  const startDate = today.previousMonth();
  const endDate = today.nextYear();

  const memberLeaves: LeaveRecord[] = (
    await Promise.all(
      memberRefs.map(async (memberRef) => {
        return getLeavesForDateRange(
          resourceRef("companies", companyPk),
          memberRef,
          startDate,
          endDate
        );
      })
    )
  ).flat();

  const calendar = ical({
    name: `${team.name} Leaves`,
    method: ICalCalendarMethod.PUBLISH,
  });

  const users = await userCache();

  for (const leave of memberLeaves) {
    const event = await icalEventFromLeave(leave, users);
    if (event) {
      calendar.createEvent(event);
    }
  }

  return calendar.toString();
};
