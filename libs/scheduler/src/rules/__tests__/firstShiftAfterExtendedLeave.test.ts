/* eslint-disable playwright/no-standalone-expect */
import { describe, expect, it } from "vitest";

import { ShiftSchedule, SlotWorker, Slot } from "../../types";
import { firstShiftAfterExtendedLeave } from "../firstShiftAfterExtendedLeave";

describe("firstShiftAfterExtendedLeave", () => {
  const createMockWorker = (
    pk: string,
    name: string,
    approvedLeaves: Array<{
      start: number;
      end: number;
      type: string;
      isPersonal: boolean;
    }> = []
  ): SlotWorker => ({
    pk,
    name,
    email: `${name.toLowerCase()}@example.com`,
    emailMd5: `hash${pk}`,
    qualifications: ["qualification1"],
    approvedLeaves,
  });

  const createMockSlot = (
    id: string,
    startsOnDay: string,
    startHour: number,
    endHour: number
  ): Slot => {
    // Shift times are in seconds relative to midnight of startsOnDay
    return {
      id,
      workHours: [
        {
          start: startHour * 3600, // Convert hours to seconds from midnight
          end: endHour * 3600,
          inconvenienceMultiplier: 1,
        },
      ],
      startsOnDay,
      requiredQualifications: ["qualification1"],
      typeName: "regular",
    };
  };

  const createMockSchedule = (
    startDay: string,
    endDay: string,
    shifts: Array<{ slot: Slot; assigned: SlotWorker }>
  ): ShiftSchedule => ({
    startDay,
    endDay,
    shifts,
  });

  describe("rule validation", () => {
    it("should pass when worker has no leaves at all", () => {
      const worker = createMockWorker("1", "Worker 1", []); // No leaves
      const slot = createMockSlot("slot1", "2024-03-15", 9, 17);
      const schedule = createMockSchedule("2024-03-15", "2024-03-15", [
        { slot, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should pass when no workers have any leaves for the scheduling period", () => {
      // Multiple workers with no leaves at all
      const worker1 = createMockWorker("1", "Worker 1", []);
      const worker2 = createMockWorker("2", "Worker 2", []);
      const worker3 = createMockWorker("3", "Worker 3", []);

      const slot1 = createMockSlot("slot1", "2024-03-15", 9, 17);
      const slot2 = createMockSlot("slot2", "2024-03-16", 9, 17);
      const slot3 = createMockSlot("slot3", "2024-03-17", 9, 17);

      const schedule = createMockSchedule("2024-03-15", "2024-03-17", [
        { slot: slot1, assigned: worker1 },
        { slot: slot2, assigned: worker2 },
        { slot: slot3, assigned: worker3 },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation", "Sick Leave"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker1, worker2, worker3],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should pass when worker has no qualifying leave periods", () => {
      const worker = createMockWorker("1", "Worker 1", [
        { start: 1000, end: 2000, type: "Vacation", isPersonal: true }, // 1 day leave
      ]);
      const slot = createMockSlot("slot1", "2024-03-15", 9, 17);
      const schedule = createMockSchedule("2024-03-15", "2024-03-15", [
        { slot, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should pass when worker is assigned to first shift after qualifying leave", () => {
      // Worker has 4-day vacation (qualifying leave)
      const leaveStart = new Date("2024-03-10").getTime() / 1000; // March 10
      const leaveEnd = new Date("2024-03-13").getTime() / 1000; // March 13 (4 days)

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: leaveStart,
          end: leaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      // First shift after leave (March 14)
      const firstShiftSlot = createMockSlot("slot1", "2024-03-14", 9, 17);
      // Another shift (March 15)
      const secondShiftSlot = createMockSlot("slot2", "2024-03-15", 9, 17);

      const schedule = createMockSchedule("2024-03-14", "2024-03-15", [
        { slot: firstShiftSlot, assigned: worker }, // Worker assigned to first shift
        { slot: secondShiftSlot, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should fail when worker is not assigned to first shift after qualifying leave", () => {
      // Worker has 5-day vacation (qualifying leave)
      const leaveStart = new Date("2024-03-10").getTime() / 1000; // March 10
      const leaveEnd = new Date("2024-03-14").getTime() / 1000; // March 14 (5 days)

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: leaveStart,
          end: leaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);
      const otherWorker = createMockWorker("2", "Worker 2", []);

      // First shift after leave (March 15) - assigned to other worker
      const firstShiftSlot = createMockSlot("slot1", "2024-03-15", 9, 17);
      // Second shift (March 16) - assigned to our worker
      const secondShiftSlot = createMockSlot("slot2", "2024-03-16", 9, 17);

      const schedule = createMockSchedule("2024-03-15", "2024-03-16", [
        { slot: firstShiftSlot, assigned: otherWorker }, // Wrong assignment
        { slot: secondShiftSlot, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid, problemInSlotId] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker, otherWorker],
        ruleOptions
      );

      expect(valid).toBe(false);
      expect(problemInSlotId).toBe("slot1");
    });

    it("should only consider applicable leave types", () => {
      // Worker has 4-day vacation but also 1-day sick leave
      const vacationStart = new Date("2024-03-10").getTime() / 1000;
      const vacationEnd = new Date("2024-03-13").getTime() / 1000; // 4 days
      const sickStart = new Date("2024-03-20").getTime() / 1000;
      const sickEnd = new Date("2024-03-20").getTime() / 1000; // 1 day

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: vacationStart,
          end: vacationEnd,
          type: "Vacation",
          isPersonal: true,
        },
        {
          start: sickStart,
          end: sickEnd,
          type: "Sick Leave",
          isPersonal: true,
        },
      ]);

      // First shift after vacation (March 14)
      const firstShiftSlot = createMockSlot("slot1", "2024-03-14", 9, 17);
      // Shift after sick leave (March 21)
      const secondShiftSlot = createMockSlot("slot2", "2024-03-21", 9, 17);

      const schedule = createMockSchedule("2024-03-14", "2024-03-21", [
        { slot: firstShiftSlot, assigned: worker },
        { slot: secondShiftSlot, assigned: worker },
      ]);

      // Only apply rule to Vacation, not Sick Leave
      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should pass when rule is active but no applicable leave types are selected", () => {
      // Worker has 4-day vacation (qualifying leave)
      const leaveStart = new Date("2024-03-10").getTime() / 1000;
      const leaveEnd = new Date("2024-03-13").getTime() / 1000; // 4 days

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: leaveStart,
          end: leaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      // First shift after leave (March 14) - assigned to other worker
      const firstShiftSlot = createMockSlot("slot1", "2024-03-14", 9, 17);
      const otherWorker = createMockWorker("2", "Worker 2", []);

      const schedule = createMockSchedule("2024-03-14", "2024-03-14", [
        { slot: firstShiftSlot, assigned: otherWorker }, // Wrong assignment
      ]);

      // Rule is active but no leave types are selected
      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: [], // Empty array - no leave types selected
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker, otherWorker],
        ruleOptions
      );

      // Should pass because no leave types are applicable, so no rules to enforce
      expect(valid).toBe(true);
    });

    it("should pass when leave period ends but there are no shifts available after", () => {
      // Worker has 4-day vacation ending on March 13
      const leaveStart = new Date("2024-03-10").getTime() / 1000;
      const leaveEnd = new Date("2024-03-13").getTime() / 1000; // 4 days

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: leaveStart,
          end: leaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      // Schedule only has shifts BEFORE the leave period (March 8-9)
      // No shifts available after March 13
      const beforeLeaveSlot1 = createMockSlot("slot1", "2024-03-08", 9, 17);
      const beforeLeaveSlot2 = createMockSlot("slot2", "2024-03-09", 9, 17);

      const schedule = createMockSchedule("2024-03-08", "2024-03-09", [
        { slot: beforeLeaveSlot1, assigned: worker },
        { slot: beforeLeaveSlot2, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      // Should pass because there are no shifts after the leave period to assign
      expect(valid).toBe(true);
    });

    it("should pass when leave period extends beyond all available shifts", () => {
      // Worker has vacation from March 10 to March 20 (11 days)
      const leaveStart = new Date("2024-03-10").getTime() / 1000;
      const leaveEnd = new Date("2024-03-20").getTime() / 1000; // 11 days

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: leaveStart,
          end: leaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      // Schedule only has shifts BEFORE the leave period (March 8-9)
      // Leave extends well beyond the available shifts
      const beforeLeaveSlot1 = createMockSlot("slot1", "2024-03-08", 9, 17);
      const beforeLeaveSlot2 = createMockSlot("slot2", "2024-03-09", 9, 17);

      const schedule = createMockSchedule("2024-03-08", "2024-03-09", [
        { slot: beforeLeaveSlot1, assigned: worker },
        { slot: beforeLeaveSlot2, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      // Should pass because there are no shifts after the leave period to assign
      expect(valid).toBe(true);
    });

    it("should handle continuous leave periods correctly", () => {
      // Worker has two consecutive 2-day leaves that form a 4-day continuous period
      const firstLeaveStart = new Date("2024-03-10").getTime() / 1000; // March 10
      const firstLeaveEnd = new Date("2024-03-11").getTime() / 1000; // March 11
      const secondLeaveStart = new Date("2024-03-12").getTime() / 1000; // March 12
      const secondLeaveEnd = new Date("2024-03-13").getTime() / 1000; // March 13

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: firstLeaveStart,
          end: firstLeaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
        {
          start: secondLeaveStart,
          end: secondLeaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      // First shift after continuous leave (March 14)
      const firstShiftSlot = createMockSlot("slot1", "2024-03-14", 9, 17);

      const schedule = createMockSchedule("2024-03-14", "2024-03-14", [
        { slot: firstShiftSlot, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should not consider non-continuous leave periods", () => {
      // Worker has two separate 2-day leaves with a gap
      const firstLeaveStart = new Date("2024-03-10").getTime() / 1000; // March 10
      const firstLeaveEnd = new Date("2024-03-11").getTime() / 1000; // March 11
      const secondLeaveStart = new Date("2024-03-13").getTime() / 1000; // March 13 (gap on March 12)
      const secondLeaveEnd = new Date("2024-03-14").getTime() / 1000; // March 14

      const worker = createMockWorker("1", "Worker 1", [
        {
          start: firstLeaveStart,
          end: firstLeaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
        {
          start: secondLeaveStart,
          end: secondLeaveEnd,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      // First shift after first leave (March 12) - should not trigger rule
      const firstShiftSlot = createMockSlot("slot1", "2024-03-12", 9, 17);
      // Shift after second leave (March 15)
      const secondShiftSlot = createMockSlot("slot2", "2024-03-15", 9, 17);

      const schedule = createMockSchedule("2024-03-12", "2024-03-15", [
        { slot: firstShiftSlot, assigned: worker },
        { slot: secondShiftSlot, assigned: worker },
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker],
        ruleOptions
      );

      expect(valid).toBe(true);
    });

    it("should handle multiple workers correctly", () => {
      const worker1 = createMockWorker("1", "Worker 1", [
        {
          start: new Date("2024-03-10").getTime() / 1000,
          end: new Date("2024-03-13").getTime() / 1000,
          type: "Vacation",
          isPersonal: true,
        },
      ]);
      const worker2 = createMockWorker("2", "Worker 2", [
        {
          start: new Date("2024-03-15").getTime() / 1000,
          end: new Date("2024-03-18").getTime() / 1000,
          type: "Vacation",
          isPersonal: true,
        },
      ]);

      const slot1 = createMockSlot("slot1", "2024-03-14", 9, 17); // Worker1's first shift after leave
      const slot2 = createMockSlot("slot2", "2024-03-19", 9, 17); // Worker2's first shift after leave

      const schedule = createMockSchedule("2024-03-14", "2024-03-19", [
        { slot: slot1, assigned: worker1 }, // Worker1 assigned to first shift after leave
        { slot: slot2, assigned: worker2 }, // Worker2 assigned to first shift after leave
      ]);

      const ruleOptions = {
        minimumContinuousDays: 3,
        applicableLeaveTypes: ["Vacation"],
      };

      const [valid] = firstShiftAfterExtendedLeave.function(
        schedule,
        [worker1, worker2],
        ruleOptions
      );

      expect(valid).toBe(true);
    });
  });

  describe("rule name generation", () => {
    it("should generate correct rule name", () => {
      const ruleOptions = {
        minimumContinuousDays: 5,
        applicableLeaveTypes: ["Vacation", "Sick Leave"],
      };

      const name = firstShiftAfterExtendedLeave.name(ruleOptions);
      expect(name).toBe(
        "First shift after extended leave (5+ days, types: Vacation, Sick Leave)"
      );
    });

    it("should throw error for invalid rule options", () => {
      expect(() => firstShiftAfterExtendedLeave.name("invalid")).toThrow();
      expect(() => firstShiftAfterExtendedLeave.name(null)).toThrow();
      expect(() => firstShiftAfterExtendedLeave.name({})).toThrow();
      expect(() =>
        firstShiftAfterExtendedLeave.name({ minimumContinuousDays: "5" })
      ).toThrow();
      expect(() =>
        firstShiftAfterExtendedLeave.name({ applicableLeaveTypes: "not-array" })
      ).toThrow();
    });
  });

  describe("rule function error handling", () => {
    it("should throw error for invalid rule options", () => {
      const schedule = createMockSchedule("2024-03-15", "2024-03-15", []);
      const workers = [createMockWorker("1", "Worker 1", [])];

      expect(() =>
        firstShiftAfterExtendedLeave.function(schedule, workers, "invalid")
      ).toThrow();
      expect(() =>
        firstShiftAfterExtendedLeave.function(schedule, workers, null)
      ).toThrow();
      expect(() =>
        firstShiftAfterExtendedLeave.function(schedule, workers, {})
      ).toThrow();
    });
  });
});
