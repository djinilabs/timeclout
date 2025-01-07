import crypto from "node:crypto";

import type { UserResolvers } from "./../../../types.generated";
export const User: UserResolvers = {
  /* Implement User resolver logic here */
  emailMd5: (parent) => {
    return crypto.createHash("md5").update(parent.email).digest("hex");
  },
};
