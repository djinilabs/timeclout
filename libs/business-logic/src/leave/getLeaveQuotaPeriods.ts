import { DayDate, DayDateInterval } from "@/day-date";

const getQuotaPeriodInterval = (
  date: DayDate,
  resetMonth: number
): DayDateInterval => {
  let startDate = date;
  const month = startDate.getMonth();
  // If date is before reset month, it belongs to previous year's quota period
  if (month < resetMonth) {
    startDate = startDate.previousYear();
  }
  startDate = startDate.setMonth(resetMonth);
  const endDate = startDate.nextYear().previousDay();
  return new DayDateInterval(startDate, endDate);
};

export const getLeaveQuotaPeriods = (
  resetMonth: number,
  startDate: DayDate,
  endDate: DayDate
): DayDateInterval[] => {
  if (startDate.compareTo(endDate) > 0) {
    return [];
  }

  const periods: DayDateInterval[] = [];

  let lastPeriod = getQuotaPeriodInterval(startDate, resetMonth);
  periods.push(lastPeriod);
  while (lastPeriod.end.compareTo(endDate) < 0) {
    lastPeriod = lastPeriod.nextYear();
    periods.push(lastPeriod);
  }

  return periods;
};
