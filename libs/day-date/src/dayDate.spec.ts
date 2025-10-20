 
import { describe, it, expect } from "vitest";

import { DayDate } from "./dayDate";

describe("DayDate", () => {
  describe("constructor", () => {
    it("creates from year/month/day numbers", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.toString()).toBe("2023-12-25");
    });

    it("creates from Date object", () => {
      const jsDate = new Date("2023-12-25T00:00:00Z");
      const date = new DayDate(jsDate);
      expect(date.toString()).toBe("2023-12-25");
    });

    it("creates from ISO string", () => {
      const date = new DayDate("2023-12-25");
      expect(date.toString()).toBe("2023-12-25");
    });

    it("fixes invalid dates", () => {
      const date = new DayDate(2023, 13, 32); // Invalid month and day
      expect(date.toString()).toBe("2024-02-01");
    });

    it("fixes overflowing months", () => {
      const date = new DayDate(2023, 14, 1); // Month 14 should overflow to next year
      expect(date.toString()).toBe("2024-02-01");

      const date2 = new DayDate(2023, 24, 1); // Month 24 should overflow 2 years
      expect(date2.toString()).toBe("2024-12-01");
    });

    it("fixes negative months", () => {
      const date = new DayDate(2023, -1, 1); // Month -1 should go to previous year
      expect(date.toString()).toBe("2022-11-01");

      const date2 = new DayDate(2023, -11, 1); // Month -12 should go back one year
      expect(date2.toString()).toBe("2022-01-01");
    });

    it("fixes overflowing days", () => {
      const date = new DayDate(2023, 1, 32); // Day 32 in January should go to February
      expect(date.toString()).toBe("2023-02-01");

      const date2 = new DayDate(2023, 12, 32); // December overflow goes to next year
      expect(date2.toString()).toBe("2024-01-01");
    });

    it("fixes negative days", () => {
      const date = new DayDate(2023, 3, 0); // -1 day in March goes to February
      expect(date.toString()).toBe("2023-02-28");

      const date2 = new DayDate(2023, 1, 0); // January underflow goes to previous year
      expect(date2.toString()).toBe("2022-12-31");
    });

    it("throws on invalid date string", () => {
      expect(() => new DayDate("invalid")).toThrow();
    });
  });

  describe("date operations", () => {
    it("gets week day", () => {
      const date = new DayDate(2023, 12, 25); // Monday
      expect(date.getWeekDay()).toBe("monday");
      expect(date.getWeekDayNumber()).toBe(0);
    });

    it("gets month day number", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.getMonthDayNumber()).toBe(25);
    });

    it("gets month", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.getMonth()).toBe(12);
    });

    it("gets year", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.getYear()).toBe(2023);
    });

    it("sets month", () => {
      const date = new DayDate(2023, 12, 25);
      const newDate = date.setMonth(6);
      expect(newDate.toString()).toBe("2023-06-25");
    });
  });

  describe("navigation", () => {
    it("moves to next day", () => {
      const date = new DayDate(2023, 12, 31);
      expect(date.nextDay().toString()).toBe("2024-01-01");
      expect(date.nextDay(2).toString()).toBe("2024-01-02");
    });

    it("moves to previous day", () => {
      const date = new DayDate(2024, 1, 1);
      expect(date.previousDay().toString()).toBe("2023-12-31");
      expect(date.previousDay(2).toString()).toBe("2023-12-30");
    });

    it("moves to next month", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.nextMonth().toString()).toBe("2024-01-25");
      expect(date.nextMonth(2).toString()).toBe("2024-02-25");
    });

    it("moves to previous month", () => {
      const date = new DayDate(2024, 1, 25);
      expect(date.previousMonth().toString()).toBe("2023-12-25");
      expect(date.previousMonth(2).toString()).toBe("2023-11-25");
    });

    it("moves to next year", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.nextYear().toString()).toBe("2024-12-25");
    });

    it("moves to previous year", () => {
      const date = new DayDate(2024, 12, 25);
      expect(date.previousYear().toString()).toBe("2023-12-25");
    });
  });

  describe("month boundaries", () => {
    it("gets first day of month", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.firstOfMonth().toString()).toBe("2023-12-01");
    });

    it("gets end of month", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.endOfMonth().toString()).toBe("2023-12-31");
    });

    it("gets month back fill", () => {
      const date = new DayDate(2023, 12, 1); // Friday
      expect(date.fullMonthBackFill().toString()).toBe("2023-11-27");
    });

    it("gets month forward fill", () => {
      const date = new DayDate(2024, 12, 30); // Monday
      expect(date.fullMonthForwardFill().toString()).toBe("2025-01-06");
    });
  });

  describe("comparison", () => {
    it("compares dates", () => {
      const date1 = new DayDate(2023, 12, 25);
      const date2 = new DayDate(2023, 12, 26);
      expect(date1.compareTo(date2)).toBeLessThan(0);
      expect(date2.compareTo(date1)).toBeGreaterThan(0);
      expect(date1.compareTo(date1.clone())).toBe(0);
    });

    it("checks for same day", () => {
      const date1 = new DayDate(2023, 12, 25);
      const date2 = new DayDate(2023, 12, 25);
      const date3 = new DayDate(2023, 12, 26);
      expect(date1.isSameDay(date2)).toBe(true);
      expect(date1.isSameDay(date3)).toBe(false);
    });
  });

  describe("conversion", () => {
    it("converts to string", () => {
      const date = new DayDate(2023, 12, 25);
      expect(date.toString()).toBe("2023-12-25");
    });

    it("converts to Date", () => {
      const date = new DayDate(2023, 12, 25);
      const jsDate = date.toDate();
      expect(jsDate instanceof Date).toBe(true);
      expect(jsDate.toISOString().startsWith("2023-12-25")).toBe(true);
    });
  });

  describe("static methods", () => {
    it("gets today's date", () => {
      const today = DayDate.today();
      const jsToday = new Date();
      expect(today.getYear()).toBe(jsToday.getUTCFullYear());
      expect(today.getMonth()).toBe(jsToday.getUTCMonth() + 1);
      expect(today.getMonthDayNumber()).toBe(jsToday.getUTCDate());
    });
  });

  describe("getWeekNumber", () => {
    it("gets week number for dates in different parts of year", () => {
      expect(new DayDate(2023, 1, 1).getWeekNumber()).toBe(52); // Sunday in last week of 2022
      expect(new DayDate(2023, 1, 2).getWeekNumber()).toBe(1); // First Monday of 2023
      expect(new DayDate(2023, 6, 15).getWeekNumber()).toBe(24); // Mid-year
      expect(new DayDate(2023, 12, 31).getWeekNumber()).toBe(52); // Last day of year
    });

    it("handles week numbers around year boundaries", () => {
      expect(new DayDate(2022, 12, 31).getWeekNumber()).toBe(52);
      expect(new DayDate(2023, 1, 1).getWeekNumber()).toBe(52);
      expect(new DayDate(2023, 1, 2).getWeekNumber()).toBe(1);
      expect(new DayDate(2024, 1, 1).getWeekNumber()).toBe(1);
    });

    it("gets correct week numbers for specific edge cases", () => {
      expect(new DayDate(2023, 3, 1).getWeekNumber()).toBe(9); // March 1st
      expect(new DayDate(2023, 12, 28).getWeekNumber()).toBe(52); // End of year
      expect(new DayDate(2023, 4, 15).getWeekNumber()).toBe(15); // Mid-April
    });
  });
});
