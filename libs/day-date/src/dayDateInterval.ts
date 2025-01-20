import { DayDate } from "./dayDate";

export class DayDateInterval {
  start: DayDate;
  end: DayDate;

  constructor(start: DayDate, end: DayDate) {
    this.start = start;
    this.end = end;
  }

  getDays() {
    const days: DayDate[] = [];
    for (
      let day = this.start;
      day.compareTo(this.end) <= 0;
      day = day.nextDay()
    ) {
      days.push(day);
    }
    return days;
  }

  nextYear() {
    return new DayDateInterval(this.start.nextYear(), this.end.nextYear());
  }

  intersect(interval: DayDateInterval) {
    const start =
      this.start.compareTo(interval.start) >= 0 ? this.start : interval.start;
    const end = this.end.compareTo(interval.end) <= 0 ? this.end : interval.end;
    return new DayDateInterval(start, end);
  }
}
