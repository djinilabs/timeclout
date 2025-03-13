import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SchedulerWorkerClient } from "../schedulerWorkerClient";
import type { SchedulerState, SchedulerOptions } from "@/scheduler";

// Mock the worker module before any imports
vi.mock("../schedulerWorker?worker", () => {
  return {
    default: class MockWorker {
      onmessage: ((ev: MessageEvent) => void) | null = null;
      private intervalId: NodeJS.Timeout | null = null;

      constructor() {
        setTimeout(() => this.startGeneratingProgress(), 0);
      }

      private startGeneratingProgress() {
        this.intervalId = setInterval(() => {
          if (this.onmessage) {
            this.onmessage(
              new MessageEvent("message", {
                data: {
                  cycleCount: Math.floor(Math.random() * 100),
                  computed: Math.floor(Math.random() * 50),
                  discardedReasons: new Map(),
                  problemInSlotIds: new Map(),
                  topSolutions: [
                    {
                      score: Math.random(),
                      heuristicScores: [],
                      schedule: {
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
                            assigned: {
                              pk: "1",
                              name: "Worker 1",
                              email: "worker1@example.com",
                              emailMd5: "hash1",
                              qualifications: ["qualification1"],
                              approvedLeaves: [],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              })
            );
          }
        }, 100);
      }

      postMessage(): void {}

      terminate(): void {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      }
    },
  };
});

const mockWorkers = [
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

const mockSlots = [
  {
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

const defaultOptions: SchedulerOptions = {
  startDay: "2024-03-15",
  endDay: "2024-03-16",
  keepTopSolutionsCount: 3,
  heuristics: {
    "Worker Slot Equality": 1,
    "Worker Slot Proximity": 1,
    "Worker Inconvenience Equality": 1,
  },
  rules: {
    minimumFrequency: 24 * 60 * 60,
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
};

describe("SchedulerWorkerClient", () => {
  let client: SchedulerWorkerClient;

  beforeEach(() => {
    client = new SchedulerWorkerClient();
  });

  afterEach(() => {
    try {
      client.stop();
    } catch (e) {
      // Ignore errors if worker wasn't started
    }
  });

  it("should initialize without throwing", () => {
    expect(() => new SchedulerWorkerClient()).not.toThrow();
  });

  it(
    "should start and receive progress updates",
    async () => {
      const progressUpdates: SchedulerState[] = [];

      await new Promise<void>((resolve) => {
        client.start(defaultOptions, (progress) => {
          progressUpdates.push(progress);
          if (progressUpdates.length >= 2) {
            resolve();
          }
        });
      });

      client.stop();

      expect(progressUpdates.length).toBeGreaterThanOrEqual(2);
      progressUpdates.forEach((update) => {
        expect(update).toHaveProperty("cycleCount");
        expect(update).toHaveProperty("computed");
        expect(update).toHaveProperty("topSolutions");
      });
    },
    { timeout: 10000 }
  );

  it("should throw when starting an already started worker", async () => {
    await client.start(defaultOptions);
    await expect(client.start(defaultOptions)).rejects.toThrow(
      "Worker already started"
    );
  });

  it("should throw when stopping a non-started worker", () => {
    expect(() => client.stop()).toThrow("Worker not started");
  });

  it(
    "should handle multiple start/stop cycles",
    async () => {
      const runCycle = async () => {
        const progressUpdates: SchedulerState[] = [];

        await new Promise<void>((resolve) => {
          client.start(defaultOptions, (progress) => {
            progressUpdates.push(progress);
            if (progressUpdates.length >= 1) {
              resolve();
            }
          });
        });

        client.stop();
        return progressUpdates;
      };

      // Run three cycles
      for (let i = 0; i < 3; i++) {
        const updates = await runCycle();
        expect(updates.length).toBeGreaterThanOrEqual(1);
      }
    },
    { timeout: 10000 }
  );

  it(
    "should generate valid schedules through the worker",
    async () => {
      let lastState: SchedulerState | null = null;

      await new Promise<void>((resolve) => {
        client.start(defaultOptions, (progress) => {
          lastState = progress;
          if (progress.computed > 0 && progress.topSolutions.length > 0) {
            resolve();
          }
        });
      });

      client.stop();

      expect(lastState).toBeTruthy();
      const solution = lastState!.topSolutions[0];

      expect(solution).toHaveProperty("score");
      expect(solution).toHaveProperty("schedule");
      expect(solution.schedule).toHaveProperty("shifts");
      expect(solution.schedule.shifts.length).toBeGreaterThan(0);

      solution.schedule.shifts.forEach((shift) => {
        expect(shift).toHaveProperty("slot");
        expect(shift).toHaveProperty("assigned");
        expect(shift.slot).toHaveProperty("workHours");
        expect(shift.slot.workHours).toBeInstanceOf(Array);
      });
    },
    { timeout: 10000 }
  );
});
