import crypto from "node:crypto";
import { database } from "@/tables";
import { getResourceRef } from "@/utils";
import type {
  UserResolvers,
  User as UserType,
} from "./../../../types.generated";

export const User: UserResolvers = {
  email: (parent) => {
    return parent.email ?? "";
  },
  emailMd5: (parent) => {
    return (
      (parent.email &&
        crypto.createHash("md5").update(parent.email).digest("hex")) ??
      ""
    );
  },
  settings: async (parent, args) => {
    const { entity_settings } = await database();
    return (await entity_settings.get(parent.pk, args.name))?.settings;
  },
  createdBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (parent as unknown as { createdBy?: string }).createdBy;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as UserType;
  },
  updatedBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where updatedBy is a string
    const userRef = (parent as unknown as { updatedBy?: string }).updatedBy;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as UserType;
  },
};
