import { describe, expect, it } from "vitest";

import type { ShiftSchedule, WorkSchedule } from "../../types";
import {
  calculateAvoidNonWorkDayFirstShiftDeviation,
  createAvoidNonWorkDayFirstShiftHeuristic,
} from "../avoidNonWorkDayFirstShift";

describe("avoidNonWorkDayFirstShift", () => {
  const mockWorkers = [
    {
      pk: "worker1",
      name: "Worker 1",
      email: "worker1@example.com",
      emailMd5: "hash1",
      qualifications: ["qualification1"],
      approvedLeaves: [],
    },
    {
      pk: "worker2",
      name: "Worker 2",
      email: "worker2@example.com",
      emailMd5: "hash2",
      qualifications: ["qualification1"],
      approvedLeaves: [],
    },
  ];

  const defaultWorkSchedule: WorkSchedule = {
    monday: { isWorkDay: true },
    tuesday: { isWorkDay: true },
    wednesday: { isWorkDay: true },
    thursday: { isWorkDay: true },
    friday: { isWorkDay: true },
    saturday: { isWorkDay: false },
    sunday: { isWorkDay: false },
  };

  const customWorkSchedule: WorkSchedule = {
    monday: { isWorkDay: true },
    tuesday: { isWorkDay: true },
    wednesday: { isWorkDay: true },
    thursday: { isWorkDay: true },
    friday: { isWorkDay: true },
    saturday: { isWorkDay: true }, // Saturday is a work day
    sunday: { isWorkDay: false },
  };

  const createMockSchedule = (
    shifts: Array<{
      workerPk: string;
      day: string;
    }>
  ): ShiftSchedule => ({
    startDay: "2024-03-15", // Friday
    endDay: "2024-03-22", // Next Friday
    shifts: shifts.map((shift, index) => ({
      slot: {
        id: `slot${index}`,
        workHours: [
          {
            start: 32400, // 9:00 AM
            end: 61200, // 5:00 PM
            inconvenienceMultiplier: 1,
          },
        ],
        startsOnDay: shift.day,
        requiredQualifications: ["qualification1"],
        typeName: "regular",
      },
      assigned: mockWorkers.find((w) => w.pk === shift.workerPk)!,
    })),
  });

  describe("calculateAvoidNonWorkDayFirstShiftDeviation", () => {
    it("should return 0 when all first shifts are on work days", () => {
      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-18" }, // Monday
        { workerPk: "worker2", day: "2024-03-19" }, // Tuesday
      ]);

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      expect(deviation).toBe(0);
    });

    it("should return positive deviation when first shifts are on non-work days", () => {
      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-16" }, // Saturday
        { workerPk: "worker2", day: "2024-03-17" }, // Sunday
      ]);

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      // With 2 actual violations and ~0.571 expected, deviation should be ~2.5
      expect(deviation).toBeCloseTo(2.5, 1);
    });

    it("should calculate expected value correctly for default work schedule", () => {
      // Schedule with 2 workers, both on work days
      // Expected = 0 (ideal case), Actual = 0 (no violations)
      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-18" }, // Monday
        { workerPk: "worker2", day: "2024-03-19" }, // Tuesday
      ]);

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      // With 0 actual violations and 0 expected, deviation should be 0
      expect(deviation).toBe(0);
    });

    it("should handle custom work schedule correctly", () => {
      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-16" }, // Saturday (work day in custom schedule)
        { workerPk: "worker2", day: "2024-03-17" }, // Sunday (non-work day)
      ]);

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        customWorkSchedule
      );

      // With 1 actual violation and ~0.286 expected, deviation should be ~2.5
      expect(deviation).toBeCloseTo(2.5, 1);
    });

    it("should handle multiple weeks correctly", () => {
      // Create a schedule spanning 2 weeks
      const schedule: ShiftSchedule = {
        startDay: "2024-03-15", // Friday
        endDay: "2024-03-29", // Friday 2 weeks later
        shifts: [
          // Week 1
          {
            slot: {
              id: "slot1",
              workHours: [
                {
                  start: 32400,
                  end: 61200,
                  inconvenienceMultiplier: 1,
                },
              ],
              startsOnDay: "2024-03-18", // Monday
              requiredQualifications: ["qualification1"],
              typeName: "regular",
            },
            assigned: mockWorkers[0],
          },
          // Week 2
          {
            slot: {
              id: "slot2",
              workHours: [
                {
                  start: 32400,
                  end: 61200,
                  inconvenienceMultiplier: 1,
                },
              ],
              startsOnDay: "2024-03-25", // Monday
              requiredQualifications: ["qualification1"],
              typeName: "regular",
            },
            assigned: mockWorkers[0],
          },
        ],
      };

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      // With 0 actual violations and 0 expected, deviation should be 0
      expect(deviation).toBe(0);
    });

    it("should handle empty schedule", () => {
      const schedule: ShiftSchedule = {
        startDay: "2024-03-15",
        endDay: "2024-03-22",
        shifts: [],
      };

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      expect(deviation).toBe(0);
    });

    it("should handle schedule with no workers", () => {
      const schedule: ShiftSchedule = {
        startDay: "2024-03-15",
        endDay: "2024-03-22",
        shifts: [],
      };

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      expect(deviation).toBe(0);
    });
  });

  describe("createAvoidNonWorkDayFirstShiftHeuristic", () => {
    it("should create heuristic with correct name", () => {
      const heuristic =
        createAvoidNonWorkDayFirstShiftHeuristic(defaultWorkSchedule);

      expect(heuristic.name).toBe("Avoid Non-Work Day First Shift");
    });

    it("should create heuristic that returns deviation score", () => {
      const heuristic =
        createAvoidNonWorkDayFirstShiftHeuristic(defaultWorkSchedule);

      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-16" }, // Saturday
      ]);

      const score = heuristic.eval(schedule);

      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("should use provided work schedule", () => {
      const heuristic =
        createAvoidNonWorkDayFirstShiftHeuristic(customWorkSchedule);

      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-16" }, // Saturday (work day in custom schedule)
      ]);

      const score = heuristic.eval(schedule);

      // Should have low deviation since Saturday is a work day in custom schedule
      expect(score).toBeLessThan(1);
    });

    it("should use default work schedule when none provided", () => {
      const heuristic = createAvoidNonWorkDayFirstShiftHeuristic();

      const schedule = createMockSchedule([
        { workerPk: "worker1", day: "2024-03-16" }, // Saturday (non-work day in default)
      ]);

      const score = heuristic.eval(schedule);

      // Should have higher deviation since Saturday is non-work day in default
      expect(score).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle single day schedule", () => {
      const schedule: ShiftSchedule = {
        startDay: "2024-03-15",
        endDay: "2024-03-16",
        shifts: [
          {
            slot: {
              id: "slot1",
              workHours: [
                {
                  start: 32400,
                  end: 61200,
                  inconvenienceMultiplier: 1,
                },
              ],
              startsOnDay: "2024-03-15",
              requiredQualifications: ["qualification1"],
              typeName: "regular",
            },
            assigned: mockWorkers[0],
          },
        ],
      };

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      expect(deviation).toBeGreaterThanOrEqual(0);
    });

    it("should handle schedule starting on non-Monday", () => {
      const schedule: ShiftSchedule = {
        startDay: "2024-03-16", // Saturday
        endDay: "2024-03-23", // Next Saturday
        shifts: [
          {
            slot: {
              id: "slot1",
              workHours: [
                {
                  start: 32400,
                  end: 61200,
                  inconvenienceMultiplier: 1,
                },
              ],
              startsOnDay: "2024-03-18", // Monday
              requiredQualifications: ["qualification1"],
              typeName: "regular",
            },
            assigned: mockWorkers[0],
          },
        ],
      };

      const deviation = calculateAvoidNonWorkDayFirstShiftDeviation(
        schedule,
        defaultWorkSchedule
      );

      expect(deviation).toBeGreaterThanOrEqual(0);
    });
  });
});
