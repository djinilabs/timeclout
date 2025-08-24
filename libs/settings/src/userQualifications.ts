import { z } from "zod";

const userQualificationsSchema = z.array(z.string());

export const userQualificationsParser = {
  parse: (item: unknown) => {
    try {
      return userQualificationsSchema.parse(item);
    } catch (error) {
      throw new Error(`Error parsing user qualifications: ${error.message}`);
    }
  },
};

export type UserQualifications = z.infer<typeof userQualificationsSchema>;

export type UserQualification = UserQualifications[number];
