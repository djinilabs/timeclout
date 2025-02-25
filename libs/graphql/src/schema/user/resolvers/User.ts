import crypto from "node:crypto";
import { database } from "@/tables";
import type {
  UserResolvers,
  User as UserType,
} from "./../../../types.generated";

export const User: UserResolvers = {
  emailMd5: (parent) => {
    return (
      parent.email &&
      crypto.createHash("md5").update(parent.email).digest("hex")
    );
  },
  settings: async (parent, args) => {
    const { entity_settings } = await database();
    return (await entity_settings.get(parent.pk, args.name))?.settings;
  },
  createdBy: async (parent) => {
    const { entity } = await database();
    return entity.get(
      parent.createdBy as unknown as string
    ) as unknown as UserType;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(
      parent.updatedBy as unknown as string
    ) as unknown as UserType;
  },
};
