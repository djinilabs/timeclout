 
import { describe, it, expect } from "vitest";

import { getLeaveQuotaPeriods } from "./getLeaveQuotaPeriods";

import { DayDate } from "@/day-date";

describe("getLeaveQuotaPeriods", () => {
  it("should return correct periods when reset month is January", () => {
    const resetMonth = 1; // January
    const startDate = new DayDate("2023-01-01");
    const endDate = new DayDate("2024-12-31");

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toMatchInlineSnapshot(`
      [
        DayDateInterval {
          "end": DayDate {
            "date": 2023-12-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2023-01-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2024-12-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2024-01-01T00:00:00.000Z,
          },
        },
      ]
    `);
  });

  it("should return correct periods when reset month is April", () => {
    const resetMonth = 4; // April
    const startDate = new DayDate("2023-04-01");
    const endDate = new DayDate("2025-04-01");

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toMatchInlineSnapshot(`
      [
        DayDateInterval {
          "end": DayDate {
            "date": 2024-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2023-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2025-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2024-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2026-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2025-04-01T00:00:00.000Z,
          },
        },
      ]
    `);
  });

  it("should handle dates before reset month", () => {
    const resetMonth = 4; // April
    const startDate = new DayDate("2023-03-01"); // Before April reset
    const endDate = new DayDate("2024-03-01");

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toMatchInlineSnapshot(`
      [
        DayDateInterval {
          "end": DayDate {
            "date": 2023-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2022-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2024-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2023-04-01T00:00:00.000Z,
          },
        },
      ]
    `);
  });

  it("should handle dates spanning 3 periods with January reset", () => {
    const resetMonth = 1; // January
    const startDate = new DayDate("2023-01-01");
    const endDate = new DayDate("2026-01-01");

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toMatchInlineSnapshot(`
      [
        DayDateInterval {
          "end": DayDate {
            "date": 2023-12-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2023-01-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2024-12-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2024-01-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2025-12-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2025-01-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2026-12-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2026-01-01T00:00:00.000Z,
          },
        },
      ]
    `);
  });

  it("should handle dates spanning 4 periods with April reset", () => {
    const resetMonth = 4; // April
    const startDate = new DayDate("2023-04-01");
    const endDate = new DayDate("2027-04-01");

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toMatchInlineSnapshot(`
      [
        DayDateInterval {
          "end": DayDate {
            "date": 2024-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2023-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2025-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2024-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2026-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2025-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2027-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2026-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2028-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2027-04-01T00:00:00.000Z,
          },
        },
      ]
    `);
  });

  it("should handle dates spanning 3 periods when starting before reset month", () => {
    const resetMonth = 4; // April
    const startDate = new DayDate("2023-03-01"); // Before April reset
    const endDate = new DayDate("2025-05-01");

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toMatchInlineSnapshot(`
      [
        DayDateInterval {
          "end": DayDate {
            "date": 2023-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2022-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2024-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2023-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2025-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2024-04-01T00:00:00.000Z,
          },
        },
        DayDateInterval {
          "end": DayDate {
            "date": 2026-03-31T00:00:00.000Z,
          },
          "start": DayDate {
            "date": 2025-04-01T00:00:00.000Z,
          },
        },
      ]
    `);
  });
});
