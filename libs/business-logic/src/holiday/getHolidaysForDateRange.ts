import { notFound } from "@hapi/boom";

import { getEntitySettings } from "../entity/getEntitySettings";

import { DayDate } from "@/day-date";
import { getHolidays } from "@/holidays";
import { i18n } from "@/locales";
import { ResourceRef } from "@/utils";


export const getHolidaysForDateRange = async (
  userReference: ResourceRef,
  startDate: DayDate,
  endDate: DayDate
): Promise<Record<string, string>> => {
  // get user country and region
  const locationSettings = await getEntitySettings<"location">(
    userReference,
    "location"
  );
  if (locationSettings == undefined) {
    throw notFound(i18n._("User location settings not found"));
  }
  const { country, region } = locationSettings;

  return getHolidays(country, region, "EN", startDate, endDate);
};
