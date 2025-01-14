export type Day = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type Month = {
  name: string;
  days: Day[];
};

export const generateYearMonthsDays = (year: number) => {
  const months: Array<Month> = [];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date().toISOString().split("T")[0];

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const month: Month = {
      name: monthNames[monthIndex],
      days: [],
    };

    // Get first day of current month
    const firstOfMonth = new Date(year, monthIndex, 1);

    // Get last day of previous month
    const lastOfPrevMonth = new Date(year, monthIndex, 0);

    // Get first day of week for current month (0-6)
    const firstDayOfWeek = (firstOfMonth.getDay() - 1) % 7;

    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDate = lastOfPrevMonth.getDate() - i;
      const date = new Date(year, monthIndex - 1, prevMonthDate);
      month.days.push({
        date: date.toISOString().split("T")[0],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add days from current month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      month.days.push({
        date,
        isCurrentMonth: true,
        isToday: date === today,
      });
    }

    // Add days from next month to complete grid
    // Calculate if we need 5 or 6 weeks
    const totalDays = month.days.length;
    const weeksNeeded = Math.ceil(totalDays / 7);
    const targetDays = weeksNeeded * 7;
    const remainingDays = targetDays - month.days.length;

    for (let i = 1; i <= remainingDays; i++) {
      const date = `${year}-${monthIndex + 1}-${i}`;
      month.days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    months.push(month);
  }

  return months;
};
