import { z } from "zod";

const yearlyUserQuotasSchema = z.array(
  z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
    quota: z.number(),
  })
);

export const yearlyUserQuotasParser = {
  parse: (item: unknown) => {
    try {
      return yearlyUserQuotasSchema.parse(item);
    } catch (err) {
      throw new Error(`Error parsing leave type: ${err.message}`);
    }
  },
};

export type YearlyUserQuotas = z.infer<typeof yearlyUserQuotasSchema>;
