import { notFound } from "@hapi/boom";
import { z } from "zod";
import { ResourceRef } from "@/utils";
import { getEntitySettings } from "../entity/getEntitySettings";

const createDayDate = (date: string) => {
  return new Date(date + "T00:00:00Z");
};

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
  startDate: string,
  endDate: string
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
      const startDate = createDayDate(holiday.startDate);
      const endDate = createDayDate(holiday.endDate);
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        all[date.toISOString().split("T")[0]] = holiday.name;
      }
      return all;
    }, {});
};
