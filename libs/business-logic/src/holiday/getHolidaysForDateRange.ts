import { notFound } from "@hapi/boom";
import { ResourceRef } from "@/utils";
import { DayDate } from "@/day-date";
import { getHolidays } from "@/holidays";
import { i18n } from "@/locales";
import { getEntitySettings } from "../entity/getEntitySettings";

export const getHolidaysForDateRange = async (
  userRef: ResourceRef,
  startDate: DayDate,
  endDate: DayDate
): Promise<Record<string, string>> => {
  // get user country and region
  const locationSettings = await getEntitySettings<"location">(
    userRef,
    "location"
  );
  if (locationSettings == null) {
    throw notFound(i18n._("User location settings not found"));
  }
  const { country, region } = locationSettings;

  return getHolidays(country, region, "EN", startDate, endDate);
};
