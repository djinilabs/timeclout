import { z } from "zod";

const qualificationsSchema = z.array(
  z.object({
    name: z.string(),
    color: z.enum([
      "green",
      "red",
      "blue",
      "yellow",
      "purple",
      "orange",
      "pink",
      "gray",
    ]),
  })
);

export const qualificationsParser = {
  parse: (item: unknown) => {
    try {
      return qualificationsSchema.parse(item);
    } catch (err) {
      throw new Error(`Error parsing qualifications: ${err.message}`);
    }
  },
};

export type Qualifications = z.infer<typeof qualificationsSchema>;

export type Qualification = Qualifications[number];
