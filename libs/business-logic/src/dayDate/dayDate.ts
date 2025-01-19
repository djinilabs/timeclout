export class DayDate {
  private date: Date;

  constructor(date: string | Date) {
    if (typeof date === "string") {
      this.date = new Date(date + "T00:00:00Z");
    } else {
      this.date = date;
    }
  }

  clone() {
    return new DayDate(new Date(this.date));
  }

  getMonth() {
    return this.date.getUTCMonth() + 1;
  }

  setMonth(month: number) {
    const newDate = new Date(this.date);
    newDate.setUTCMonth(month - 1);
    return new DayDate(newDate);
  }

  getYear() {
    return this.date.getUTCFullYear();
  }

  nextDay() {
    const nextDay = new Date(this.date);
    nextDay.setUTCDate(this.date.getUTCDate() + 1);
    return new DayDate(nextDay);
  }

  previousDay() {
    const previousDay = new Date(this.date);
    previousDay.setUTCDate(this.date.getUTCDate() - 1);
    return new DayDate(previousDay);
  }

  nextYear() {
    const nextYear = new Date(this.date);
    nextYear.setUTCFullYear(this.date.getUTCFullYear() + 1);
    return new DayDate(nextYear);
  }

  previousYear() {
    const previousYear = new Date(this.date);
    previousYear.setUTCFullYear(this.date.getUTCFullYear() - 1);
    return new DayDate(previousYear);
  }

  compareTo(dayDate: DayDate) {
    return this.date.getTime() - dayDate.date.getTime();
  }

  toString() {
    return this.date.toISOString().split("T")[0];
  }
}
