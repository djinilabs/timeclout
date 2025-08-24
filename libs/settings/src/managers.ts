import { z } from "zod";

import { getResourceRef } from "@/utils";

const managersSchema = z.array(z.string().refine(getResourceRef));

export const managersParser = {
  parse: (item: unknown) => {
    try {
      return managersSchema.parse(item);
    } catch (error) {
      error.message = `Error parsing managers: ${error.message}`;
      throw error;
    }
  },
};

export type Managers = z.infer<typeof managersSchema>;
