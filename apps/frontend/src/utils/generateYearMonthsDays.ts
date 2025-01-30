import { DayDate } from "@/day-date";
import { generateMonthDays } from "./generateMonthDays";
import { months } from "./months";

export type Day = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type Month = {
  name: string;
  days: Day[];
};

export const generateYearMonthsDays = (year: number) =>
  months.map((month, monthIndex) => ({
    name: month,
    days: generateMonthDays(year, monthIndex, DayDate.today()),
  }));
