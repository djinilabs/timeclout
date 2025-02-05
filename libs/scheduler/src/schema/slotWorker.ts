import { z } from "zod";
import { SlotWorker } from "../types";

const SlotWorkerSchema = z.object({
  id: z.string(),
  name: z.string(),
  experience: z.number(),
  unavailable: z.boolean().optional(),
  unavailableShiftsForPersonalReasons: z.array(z.number().int()),
  unavailableShiftsForWorkReasons: z.array(z.number().int()),
});

class SlotWorkerImpl implements SlotWorker {
  id: string;
  name: string;
  experience: number;
  unavailable: boolean;
  private unavailableShiftsForPersonalReasons: Set<number>;
  private unavailableShiftsForWorkReasons: Set<number>;

  constructor({
    id,
    name,
    experience,
    unavailable = false,
    unavailableShiftsForPersonalReasons,
    unavailableShiftsForWorkReasons,
  }: {
    id: string;
    name: string;
    experience: number;
    unavailable?: boolean;
    unavailableShiftsForPersonalReasons: Array<number>;
    unavailableShiftsForWorkReasons: Array<number>;
  }) {
    this.id = id;
    this.name = name;
    this.experience = experience;
    this.unavailable = unavailable;
    this.unavailableShiftsForPersonalReasons = new Set(
      unavailableShiftsForPersonalReasons
    );
    this.unavailableShiftsForWorkReasons = new Set(
      unavailableShiftsForWorkReasons
    );
  }

  isAvailableToWork(shift: number): boolean {
    return (
      !this.unavailable &&
      !this.unavailableShiftsForPersonalReasons.has(shift) &&
      !this.unavailableShiftsForWorkReasons.has(shift)
    );
  }

  unavailableForWorkReasonsShiftCount(): number {
    return this.unavailableShiftsForWorkReasons.size;
  }

  unavailableForPersonalReasonsShiftCount(): number {
    return this.unavailableShiftsForPersonalReasons.size;
  }
}

export const parseSlotWorkerRaw = (slotWorker: unknown) =>
  SlotWorkerSchema.parse(slotWorker);

export const parseSlotWorker = (slotWorker: unknown): SlotWorker =>
  new SlotWorkerImpl(SlotWorkerSchema.parse(slotWorker));
