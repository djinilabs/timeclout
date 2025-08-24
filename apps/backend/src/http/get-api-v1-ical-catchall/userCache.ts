import { database, EntityRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export interface UserCache {
  getUser(userReference: ResourceRef<"users">): Promise<EntityRecord | undefined>;
}

export const userCache = async (): Promise<UserCache> => {
  const cache = new Map<ResourceRef<"users">, EntityRecord>();
  const { entity } = await database();

  return {
    getUser: async (userReference) => {
      let user = cache.get(userReference);
      if (user) {
        return user;
      }
      user = await entity.get(userReference);
      if (!user) {
        return;
      }
      cache.set(userReference, user);
      return user;
    },
  };
};
