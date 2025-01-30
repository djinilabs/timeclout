import { DayDate } from "@/day-date";

export type Day = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export const generateMonthDays = (
  year: number,
  month: number,
  today: DayDate
): Day[] => {
  const days: Day[] = [];

  // Get first day of current month
  const firstOfMonth = new DayDate(year, month + 1, 1);

  // Get first day of week for current month (0-6)
  const firstDayOfWeek = (firstOfMonth.getWeekDayNumber() + 6) % 7;

  // Add days from previous month
  for (let i = firstDayOfWeek; i > 0; i--) {
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
    const date = new DayDate(year, month + 1, day);
    days.push({
      date: date.toString(),
      isCurrentMonth: true,
      isToday: date.isSameDay(today),
    });
  }

  // Add days from next month to complete grid
  // Calculate if we need 5 or 6 weeks
  const totalDays = days.length;
  const weeksNeeded = Math.ceil(totalDays / 7);
  const targetDays = weeksNeeded * 7;
  const remainingDays = targetDays - days.length;

  for (let i = 1; i <= remainingDays; i++) {
    const date = new DayDate(year, month + 2, i);
    days.push({
      date: date.toString(),
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
};
