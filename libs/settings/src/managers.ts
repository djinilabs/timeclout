import { z } from "zod";

const managersSchema = z.array(z.string());

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
