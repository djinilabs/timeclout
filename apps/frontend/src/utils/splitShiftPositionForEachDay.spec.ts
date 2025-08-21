/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect } from "vitest";

import { splitShiftPositionForEachDay } from "./splitShiftPositionsForEachDay";

describe("splitShiftPositionForEachDay", () => {
  it("should split a shift position that spans multiple days into separate days", () => {
    const shiftPosition = {
      day: "2024-01-01",
      schedules: [
        {
          startHourMinutes: [22, 0], // 10 PM
          endHourMinutes: [26, 0], // 2 AM next day
          inconveniencePerHour: 1,
        },
      ],
    };

    const result = splitShiftPositionForEachDay(shiftPosition);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      ...shiftPosition,
      day: "2024-01-01",
      schedules: [
        {
          startHourMinutes: [22, 0],
          endHourMinutes: [24, 0],
          inconveniencePerHour: 1,
        },
      ],
    });
    expect(result[1]).toEqual({
      ...shiftPosition,
      day: "2024-01-02",
      schedules: [
        {
          startHourMinutes: [0, 0],
          endHourMinutes: [2, 0],
          inconveniencePerHour: 1,
        },
      ],
    });
  });

  it("should handle shifts within a single day", () => {
    const shiftPosition = {
      day: "2024-01-01",
      schedules: [
        {
          startHourMinutes: [9, 0],
          endHourMinutes: [17, 0],
          inconveniencePerHour: 1,
        },
      ],
    };

    const result = splitShiftPositionForEachDay(shiftPosition);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(shiftPosition);
  });

  it("should handle multiple schedules in a shift position", () => {
    const shiftPosition = {
      day: "2024-01-01",
      schedules: [
        {
          startHourMinutes: [9, 0],
          endHourMinutes: [12, 0],
          inconveniencePerHour: 1,
        },
        {
          startHourMinutes: [13, 0],
          endHourMinutes: [17, 0],
          inconveniencePerHour: 1,
        },
      ],
    };

    const result = splitShiftPositionForEachDay(shiftPosition);

    expect(result).toHaveLength(1);
    expect(result[0].schedules).toHaveLength(2);
    expect(result[0]).toEqual(shiftPosition);
  });

  it("should handle shifts spanning multiple days with gaps", () => {
    const shiftPosition = {
      day: "2024-01-01",
      schedules: [
        {
          startHourMinutes: [48, 0], // 2nd day
          endHourMinutes: [56, 0], // 2nd day
          inconveniencePerHour: 1,
        },
      ],
    };

    const result = splitShiftPositionForEachDay(shiftPosition);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      ...shiftPosition,
      day: "2024-01-01",
      schedules: [],
    });
    expect(result[1]).toEqual({
      ...shiftPosition,
      day: "2024-01-02",
      schedules: [],
    });
    expect(result[2]).toEqual({
      ...shiftPosition,
      day: "2024-01-03",
      schedules: [
        {
          startHourMinutes: [0, 0],
          endHourMinutes: [8, 0],
          inconveniencePerHour: 1,
        },
      ],
    });
  });
});
