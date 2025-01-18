import crypto from "node:crypto";
import { database } from "@/tables";
import type { UserResolvers } from "./../../../types.generated";

export const User: UserResolvers = {
  emailMd5: (parent) => {
    return crypto.createHash("md5").update(parent.email).digest("hex");
  },
  settings: async (parent, args) => {
    const { entity_settings } = await database();
    return (await entity_settings.get(parent.pk, args.name))?.settings;
  },
};
