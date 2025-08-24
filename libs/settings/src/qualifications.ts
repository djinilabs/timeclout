import { z } from "zod";

import { colorNames } from "./colors";

const qualificationsSchema = z.array(
  z.object({
    name: z.string(),
    color: z.enum(colorNames),
  })
);

export const qualificationsParser = {
  parse: (item: unknown) => {
    try {
      return qualificationsSchema.parse(item);
    } catch (error) {
      throw new Error(`Error parsing qualifications: ${error.message}`);
    }
  },
};

export type Qualifications = z.infer<typeof qualificationsSchema>;

export type Qualification = Qualifications[number];
