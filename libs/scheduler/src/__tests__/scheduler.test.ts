import { describe, expect, it } from "vitest";
import { Scheduler, SchedulerState } from "../scheduler";
import { SlotWorker, Slot } from "../types";

describe("Scheduler", () => {
  const mockWorkers: SlotWorker[] = [
    {
      pk: "1",
      name: "Worker 1",
      email: "worker1@example.com",
      emailMd5: "hash1",
      qualifications: ["qualification1"],
      approvedLeaves: [],
    },
    {
      pk: "2",
      name: "Worker 2",
      email: "worker2@example.com",
      emailMd5: "hash2",
      qualifications: ["qualification1"],
      approvedLeaves: [],
    },
  ];

  const mockSlots: Slot[] = [
    {
      id: "slot1",
      workHours: [
        {
          start: 32400, // 9:00 AM in seconds
          end: 61200, // 5:00 PM in seconds
          inconvenienceMultiplier: 1,
        },
      ],
      startsOnDay: "2024-03-15",
      requiredQualifications: ["qualification1"],
      typeName: "regular",
    },
    {
      id: "slot2",
      workHours: [
        {
          start: 32400,
          end: 61200,
          inconvenienceMultiplier: 1,
        },
      ],
      startsOnDay: "2024-03-16",
      requiredQualifications: ["qualification1"],
      typeName: "regular",
    },
  ];

  const defaultOptions = {
    startDay: "2024-03-15",
    endDay: "2024-03-16",
    keepTopSolutionsCount: 3,
    heuristics: {
      "Worker Slot Equality": 1,
      "Worker Slot Proximity": 1,
      "Worker Inconvenience Equality": 1,
    },
    rules: {
      minimumFrequency: 24 * 60 * 60, // 1 day in seconds
    },
    workers: mockWorkers,
    slots: mockSlots,
    minimumRestSlotsAfterShift: [
      {
        inconvenienceLessOrEqualThan: 100,
        minimumRestMinutes: 60,
      },
    ],
    respectLeaveSchedule: true,
    locale: "en",
  };

  it("should initialize with valid options", () => {
    const scheduler = new Scheduler(defaultOptions);
    expect(scheduler).toBeDefined();
  });

  it("should generate valid schedules", async () => {
    const scheduler = new Scheduler(defaultOptions);
    let state: SchedulerState | null = null;

    // Subscribe to scheduler updates
    scheduler.subscribe(
      (newState) => {
        state = newState;
      },
      { interval: 100 }
    );

    // Start scheduler and let it run for a short time
    scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    scheduler.stop();

    // Verify that solutions were generated
    expect(state).toBeDefined();
    expect(state!.computed).toBeGreaterThan(0);
    expect(state!.topSolutions.length).toBeGreaterThan(0);

    // Verify solution structure
    const solution = state!.topSolutions[0];
    expect(solution).toHaveProperty("score");
    expect(solution).toHaveProperty("schedule");
    expect(solution).toHaveProperty("heuristicScores");

    // Verify schedule structure
    const schedule = solution.schedule;
    expect(schedule).toHaveProperty("startDay", defaultOptions.startDay);
    expect(schedule).toHaveProperty("endDay", defaultOptions.endDay);
    expect(schedule).toHaveProperty("shifts");
    expect(schedule.shifts.length).toBe(mockSlots.length);

    // Verify each shift has required properties
    schedule.shifts.forEach((shift) => {
      expect(shift).toHaveProperty("slot");
      expect(shift).toHaveProperty("assigned");
      expect(mockWorkers).toContainEqual(shift.assigned);
    });
  });

  it("should respect minimum rest periods", async () => {
    const scheduler = new Scheduler({
      ...defaultOptions,
      minimumRestSlotsAfterShift: [
        {
          inconvenienceLessOrEqualThan: 100,
          minimumRestMinutes: 720, // 12 hours
        },
      ],
    });

    let state: SchedulerState | null = null;
    scheduler.subscribe(
      (newState) => {
        state = newState;
      },
      { interval: 100 }
    );

    scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    scheduler.stop();

    // Verify that solutions respect rest periods
    expect(state!.topSolutions.length).toBeGreaterThan(0);
    const solution = state!.topSolutions[0];

    // Sort shifts by start time
    const sortedShifts = [...solution.schedule.shifts].sort((a, b) => {
      return a.slot.workHours[0].start - b.slot.workHours[0].start;
    });

    // Check that consecutive shifts for the same worker respect rest period
    for (let i = 0; i < sortedShifts.length - 1; i++) {
      const currentShift = sortedShifts[i];
      const nextShift = sortedShifts[i + 1];

      if (currentShift.assigned.pk === nextShift.assigned.pk) {
        const currentEnd = currentShift.slot.workHours[0].end;
        const nextStart = nextShift.slot.workHours[0].start;
        const restPeriod = nextStart - currentEnd;
        expect(restPeriod).toBeGreaterThanOrEqual(720 * 60); // 12 hours in seconds
      }
    }
  });
});
