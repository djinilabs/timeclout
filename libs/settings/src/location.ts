import { z } from "zod";

const locationSchema = z.object({
  country: z.string(),
  region: z.string().optional(),
});

export const locationParser = {
  parse: (item: unknown) => {
    try {
      return locationSchema.parse(item);
    } catch (err) {
      err.message = `Error parsing location: ${err.message}`;
      throw err;
    }
  },
};

export type Location = z.infer<typeof locationSchema>;
