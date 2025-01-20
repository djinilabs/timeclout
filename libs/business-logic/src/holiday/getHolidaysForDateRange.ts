import { notFound } from "@hapi/boom";
import { z } from "zod";
import { ResourceRef } from "@/utils";
import { getEntitySettings } from "../entity/getEntitySettings";
import { DayDate } from "@/day-date";

const remoteHolidayResponseSchema = z.array(
  z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
    name: z.array(
      z.object({
        language: z.string(),
        text: z.string(),
      })
    ),
    nationwide: z.boolean(),
    subdivisions: z
      .array(
        z.object({
          code: z.string(),
        })
      )
      .optional(),
  })
);

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
    throw notFound("User location settings not found");
  }
  const { country, region } = locationSettings;
  const response = await fetch(
    `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${country}&languageIsoCode=EN&validFrom=${startDate}&validTo=${endDate}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );
  const remoteHolidays = remoteHolidayResponseSchema.parse(
    await response.json()
  );
  return remoteHolidays
    .filter((holiday) => {
      if (holiday.nationwide) {
        return true;
      }
      return holiday.subdivisions?.some(
        (subdivision) => subdivision.code === region
      );
    })
    .map((holiday) => {
      return {
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        name: holiday.name[0]?.text ?? "Unknown",
      };
    })
    .reduce((all, holiday) => {
      const startDate = new DayDate(holiday.startDate);
      const endDate = new DayDate(holiday.endDate);
      for (
        let date = startDate;
        date.compareTo(endDate) <= 0;
        date = date.nextDay()
      ) {
        all[date.toString()] = holiday.name;
      }
      return all;
    }, {});
};
