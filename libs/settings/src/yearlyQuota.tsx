import { z } from "zod";

const yearlyQuotaSchema = z.object({
  resetMonth: z.number().min(1).max(12),
  defaultQuota: z.number(),
});

export const yearlyQuotaParser = {
  parse: (item: unknown) => {
    try {
      return yearlyQuotaSchema.parse(item);
    } catch (error) {
      throw new Error(`Error parsing leave type: ${error.message}`);
    }
  },
};

export type YearlyQuota = z.infer<typeof yearlyQuotaSchema>;
