import { useQuery } from "@tanstack/react-query";
import { DayDate } from "@/day-date";
import { getHolidays } from "@/holidays";

export interface UseHolidaysProps {
  country: string;
  region: string;
  startDate: DayDate;
  endDate: DayDate;
}

export const useHolidays = ({
  country,
  region,
  startDate,
  endDate,
}: UseHolidaysProps) =>
  useQuery({
    queryKey: ["holidays", country, region, startDate, endDate],
    queryFn: () => getHolidays(country, region, "EN", startDate, endDate),
  });
