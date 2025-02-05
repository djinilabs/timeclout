import { z } from "zod";

const ConfigSchema = z.object({
  maxTryCount: z.number().int(),
  keepTopCount: z.number().int(),
  minimumRestSlotsAfterShift: z.array(
    z.object({
      inconvenienceLessOrEqualThan: z.number().int(),
      minimumRestSlots: z.number().int(),
    })
  ),
  heuristics: z.record(z.string(), z.number()),
  rules: z.object({
    minimumExperiencedWorker: z.number().optional(),
    minimumFrequency: z.number().int().optional(),
    maximumInconvenience: z.number().int().optional(),
    minimumShiftsInStandardWorkDay: z.number().int().optional(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export const parseConfig = (config: unknown): Config =>
  ConfigSchema.parse(config);

export const defaultConfig: Config = {
  maxTryCount: 15_000_000,
  keepTopCount: 1,
  minimumRestSlotsAfterShift: [],
  heuristics: {
    "Worker Slot Proximity": 1,
    "Worker Slot Equality": 1,
    "Worker Inconvenience Equality": 1,
    "Worker Experience Equality": 1,
  },
  rules: {
    minimumExperiencedWorker: 1,
    minimumFrequency: 8,
  },
};
