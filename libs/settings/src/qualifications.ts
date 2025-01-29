import { z } from "zod";

export const qualificationColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
] as const;

const qualificationsSchema = z.array(
  z.object({
    name: z.string(),
    color: z.enum(qualificationColors),
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
