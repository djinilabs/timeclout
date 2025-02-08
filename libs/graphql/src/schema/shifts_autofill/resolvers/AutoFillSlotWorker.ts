import crypto from "node:crypto";
import type { AutoFillSlotWorkerResolvers } from "./../../../types.generated";

export const AutoFillSlotWorker: AutoFillSlotWorkerResolvers = {
  /* Implement AutoFillSlotWorker resolver logic here */
  emailMd5: async ({ email }) => {
    return crypto.createHash("md5").update(email).digest("hex");
  },
};
