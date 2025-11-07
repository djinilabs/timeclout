import { z } from "zod";

import { getResourceRef } from "@/utils";

const managersSchema = z.array(z.string().refine(getResourceRef));

export const managersParser = {
  parse: (item: unknown) => {
    try {
      return managersSchema.parse(item);
    } catch (err) {
      err.message = `Error parsing managers: ${err.message}`;
      throw err;
    }
  },
};

export type Managers = z.infer<typeof managersSchema>;
