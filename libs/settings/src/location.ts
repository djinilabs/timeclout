import { z } from "zod";

const locationSchema = z.object({
  country: z.string(),
  region: z.string(),
});

export const locationParser = {
  parse: (item: unknown) => {
    try {
      return locationSchema.parse(item);
    } catch (error) {
      error.message = `Error parsing location: ${error.message}`;
      throw error;
    }
  },
};

export type Location = z.infer<typeof locationSchema>;
