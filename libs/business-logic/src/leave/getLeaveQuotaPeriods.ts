export interface LeaveQuotaPeriod {
  start: string;
  end: string;
}

const createUTCDate = (date: string): Date => {
  return new Date(date + "T00:00:00Z");
};

export const getLeaveQuotaPeriods = (
  resetMonth: number,
  startDate: string,
  endDate: string
): LeaveQuotaPeriod[] => {
  const getQuotaPeriodStartAndEnd = (
    date: Date
  ): { start: string; end: string } => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // If date is before reset month, it belongs to previous year's quota period
    const startYear = month < resetMonth ? year - 1 : year;
    const startDate = createUTCDate(
      `${startYear}-${String(resetMonth).padStart(2, "0")}-01`
    )
      .toISOString()
      .split("T")[0];
    const endDate = new Date(startDate);
    endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
    endDate.setUTCDate(endDate.getUTCDate() - 1);
    const endDateStr = endDate.toISOString().split("T")[0];
    return { start: startDate, end: endDateStr };
  };

  const periods: LeaveQuotaPeriod[] = [];
  let start = createUTCDate(startDate);
  const end = createUTCDate(endDate);

  if (start > end) {
    return [];
  }

  cycle: while (start <= end) {
    const period = getQuotaPeriodStartAndEnd(start);
    periods.push(period);
    const { end: periodEnd } = period;
    if (periodEnd >= end.toISOString().split("T")[0]) {
      break cycle;
    }
    start.setUTCFullYear(start.getUTCFullYear() + 1);
  }

  return periods;
};
