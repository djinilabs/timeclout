import { z } from "zod";
import { getResourceRef } from "@/tables";

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
