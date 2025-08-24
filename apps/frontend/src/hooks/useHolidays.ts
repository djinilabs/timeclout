import { useQuery } from "@tanstack/react-query";

import { DayDate } from "@/day-date";
import { getHolidays } from "@/holidays";

export interface UseHolidaysProperties {
  country?: string;
  region?: string;
  startDate: DayDate;
  endDate: DayDate;
}

export const useHolidays = ({
  country,
  region,
  startDate,
  endDate,
}: UseHolidaysProperties) =>
  useQuery({
    queryKey: ["holidays", country, region, startDate, endDate],
    queryFn: () => {
      if (country && region) {
        return getHolidays(country, region, "EN", startDate, endDate);
      }
      return Promise.resolve({}) as Promise<Record<string, string>>;
    },
  });
