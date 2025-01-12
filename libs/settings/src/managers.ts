import { z } from "zod";

export const managersSchema = z.array(z.string());
