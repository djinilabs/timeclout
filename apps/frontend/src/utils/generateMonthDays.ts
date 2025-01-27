import { DayDate } from "@/day-date";

export type Day = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export const generateMonthDays = (
  year: number,
  month: number,
  today: string
): Day[] => {
  const days: Day[] = [];

  // Get first day of current month
  const firstOfMonth = new DayDate(
    `${year}-${(month + 1).toString().padStart(2, "0")}-01`
  );

  // Get first day of week for current month (0-6)
  const firstDayOfWeek = (firstOfMonth.getWeekDayNumber() - 1) % 7;

  // Add days from previous month
  for (let i = firstDayOfWeek; i >= 0; i--) {
    const date = firstOfMonth.previousDay(i + 1);
    days.push({
      date: date.toString(),
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Add days from current month
  const daysInMonth = firstOfMonth.endOfMonth().getMonthDayNumber();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date === today,
    });
  }

  // Add days from next month to complete grid
  // Calculate if we need 5 or 6 weeks
  const totalDays = days.length;
  const weeksNeeded = Math.ceil(totalDays / 7);
  const targetDays = weeksNeeded * 7;
  const remainingDays = targetDays - days.length;

  for (let i = 1; i <= remainingDays; i++) {
    const date = `${year}-${month + 1}-${i}`;
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
};
