import crypto from "node:crypto";

import type {
  UserResolvers,
  User as UserType,
} from "./../../../types.generated";

import { database } from "@/tables";
import { getResourceRef } from "@/utils";

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
  settings: async (parent, arguments_) => {
    const { entity_settings } = await database();
    const result = await entity_settings.get(parent.pk, arguments_.name);
    return result?.settings;
  },
  createdBy: async (parent, _arguments, context) => {
    // Cast to access the raw database field where createdBy is a string
    const userReference = (parent as unknown as { createdBy?: string }).createdBy;
    if (!userReference) {
      return null;
    }
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as UserType;
  },
  updatedBy: async (parent, _arguments, context) => {
    // Cast to access the raw database field where updatedBy is a string
    const userReference = (parent as unknown as { updatedBy?: string }).updatedBy;
    if (!userReference) {
      return null;
    }
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as UserType;
  },
};
