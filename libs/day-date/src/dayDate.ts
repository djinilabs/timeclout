const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

// fixes the date to be valid, since users can enter overflowing months or days (like [2025, -1, 32])
const fixNumberDate = ([year, month, day]: [number, number, number]): [
  number,
  number,
  number,
] => {
  // Handle negative months by converting to positive months in previous years
  let adjustedYear = year;
  let adjustedMonth = month;
  if (month < 1) {
    const yearsToSubtract = Math.floor((Math.abs(month) + 11) / 12);
    adjustedYear -= yearsToSubtract;
    adjustedMonth += yearsToSubtract * 12;
  }

  const d = new Date(`${adjustedYear}-01-01T00:00:00Z`);
  d.setUTCMonth(adjustedMonth - 1);
  d.setUTCDate(day);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date: " + JSON.stringify([year, month, day]));
  }
  return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
};

export class DayDate {
  private date: Date;

  static today() {
    return new DayDate(new Date());
  }

  constructor(...args: [number, number, number] | [Date | string]) {
    let numberDate: [number, number, number] | undefined;
    if (args.length === 3) {
      numberDate = args;
    } else {
      const [arg] = args;
      if (typeof arg === "string") {
        const [year, month, day] = arg.split("-").map(Number);
        numberDate = [year, month, day];
      } else {
        numberDate = [
          arg.getUTCFullYear(),
          arg.getUTCMonth() + 1,
          arg.getUTCDate(),
        ];
      }
    }

    // fix if day < 1
    numberDate = fixNumberDate(numberDate);

    this.date = new Date(
      `${numberDate[0]}-${numberDate[1].toString().padStart(2, "0")}-${numberDate[2].toString().padStart(2, "0")}T00:00:00Z`
    );
    if (Number.isNaN(this.date.getTime())) {
      throw new Error(
        "Invalid date" +
          JSON.stringify(args) +
          ", number date = " +
          JSON.stringify(numberDate)
      );
    }
  }

  clone() {
    return new DayDate(new Date(this.date));
  }

  getWeekDayNumber() {
    return this.date.getUTCDay();
  }

  getWeekNumber() {
    const date = new Date(this.date);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
    const week1 = new Date(date.getUTCFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  getWeekDay() {
    return weekDays[this.date.getUTCDay()];
  }

  getMonthDayNumber() {
    return this.date.getUTCDate();
  }

  getMonth() {
    return this.date.getUTCMonth() + 1;
  }

  setMonth(month: number) {
    const newDate = new Date(this.date);
    newDate.setUTCMonth(month - 1);
    return new DayDate(newDate);
  }

  getDayOfMonth() {
    return this.date.getUTCDate();
  }

  getYear() {
    return this.date.getUTCFullYear();
  }

  nextDay(days = 1) {
    const nextDay = new Date(this.date);
    nextDay.setUTCDate(this.date.getUTCDate() + days);
    return new DayDate(nextDay);
  }

  previousDay(days = 1) {
    const previousDay = new Date(this.date);
    previousDay.setUTCDate(this.date.getUTCDate() - days);
    return new DayDate(previousDay);
  }

  nextYear() {
    const nextYear = new Date(this.date);
    nextYear.setUTCFullYear(this.date.getUTCFullYear() + 1);
    return new DayDate(nextYear);
  }

  nextMonth(months = 1) {
    const nextMonth = new Date(this.date);
    nextMonth.setUTCMonth(this.date.getUTCMonth() + months);
    return new DayDate(nextMonth);
  }

  previousMonth(months = 1) {
    const previousMonth = new Date(this.date);
    previousMonth.setUTCMonth(this.date.getUTCMonth() - months);
    return new DayDate(previousMonth);
  }

  endOfMonth() {
    const lastDay = new Date(this.date);
    lastDay.setUTCMonth(this.date.getUTCMonth() + 1, 0);
    return new DayDate(lastDay);
  }

  firstOfMonth() {
    const firstDay = new Date(this.date);
    firstDay.setUTCDate(1);
    return new DayDate(firstDay);
  }

  previousYear() {
    const previousYear = new Date(this.date);
    previousYear.setUTCFullYear(this.date.getUTCFullYear() - 1);
    return new DayDate(previousYear);
  }

  compareTo(dayDate: DayDate) {
    return this.date.getTime() - dayDate.date.getTime();
  }

  diffInMinutes(dayDate: DayDate) {
    return (this.date.getTime() - dayDate.date.getTime()) / 60000;
  }

  isSameDay(dayDate: DayDate) {
    return (
      this.isSameMonth(dayDate) &&
      this.getDayOfMonth() === dayDate.getDayOfMonth()
    );
  }

  isSameMonth(dayDate: DayDate) {
    return (
      this.date.getFullYear() === dayDate.date.getFullYear() &&
      this.date.getMonth() === dayDate.date.getMonth()
    );
  }

  isBefore(dayDate: DayDate) {
    return this.compareTo(dayDate) < 0;
  }

  toString() {
    return this.date.toISOString().split("T")[0];
  }

  toDate() {
    return this.date;
  }

  fullMonthBackFill(): DayDate {
    const firstDay = this.firstOfMonth();
    return firstDay.previousDay(firstDay.getWeekDayNumber());
  }

  fullMonthForwardFill(): DayDate {
    const lastDay = this.endOfMonth();
    // If Monday is first day of week (0), Sunday is 6
    // So we need to get days until next Sunday
    return lastDay.nextDay(7 - lastDay.getWeekDayNumber());
  }
}
