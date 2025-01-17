import { describe, it, expect } from "vitest";
import { getLeaveQuotaPeriods } from "./getLeaveQuotaPeriods";

describe("getLeaveQuotaPeriods", () => {
  it("should return correct periods when reset month is January", () => {
    const resetMonth = 1; // January
    const startDate = "2023-01-01";
    const endDate = "2024-12-31";

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toEqual([
      {
        start: "2023-01-01",
        end: "2023-12-31",
      },
      {
        start: "2024-01-01",
        end: "2024-12-31",
      },
    ]);
  });

  it("should return correct periods when reset month is April", () => {
    const resetMonth = 4; // April
    const startDate = "2023-04-01";
    const endDate = "2025-04-01";

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toEqual([
      {
        start: "2023-04-01",
        end: "2024-03-31",
      },
      {
        start: "2024-04-01",
        end: "2025-03-31",
      },
      {
        start: "2025-04-01",
        end: "2026-03-31",
      },
    ]);
  });

  it("should handle dates before reset month", () => {
    const resetMonth = 4; // April
    const startDate = "2023-03-01"; // Before April reset
    const endDate = "2024-03-01";

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toEqual([
      {
        start: "2022-04-01",
        end: "2023-03-31",
      },
      {
        start: "2023-04-01",
        end: "2024-03-31",
      },
    ]);
  });

  it("should handle dates spanning 3 periods with January reset", () => {
    const resetMonth = 1; // January
    const startDate = "2023-01-01";
    const endDate = "2026-01-01";

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toEqual([
      {
        start: "2023-01-01",
        end: "2023-12-31",
      },
      {
        start: "2024-01-01",
        end: "2024-12-31",
      },
      {
        start: "2025-01-01",
        end: "2025-12-31",
      },
      {
        start: "2026-01-01",
        end: "2026-12-31",
      },
    ]);
  });

  it("should handle dates spanning 4 periods with April reset", () => {
    const resetMonth = 4; // April
    const startDate = "2023-04-01";
    const endDate = "2027-04-01";

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toEqual([
      {
        start: "2023-04-01",
        end: "2024-03-31",
      },
      {
        start: "2024-04-01",
        end: "2025-03-31",
      },
      {
        start: "2025-04-01",
        end: "2026-03-31",
      },
      {
        start: "2026-04-01",
        end: "2027-03-31",
      },
      {
        start: "2027-04-01",
        end: "2028-03-31",
      },
    ]);
  });

  it("should handle dates spanning 3 periods when starting before reset month", () => {
    const resetMonth = 4; // April
    const startDate = "2023-03-01"; // Before April reset
    const endDate = "2025-05-01";

    const result = getLeaveQuotaPeriods(resetMonth, startDate, endDate);

    expect(result).toEqual([
      {
        start: "2022-04-01",
        end: "2023-03-31",
      },
      {
        start: "2023-04-01",
        end: "2024-03-31",
      },
      {
        start: "2024-04-01",
        end: "2025-03-31",
      },
    ]);
  });
});
