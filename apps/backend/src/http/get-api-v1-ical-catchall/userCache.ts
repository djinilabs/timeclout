import { database, EntityRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export interface UserCache {
  getUser(userRef: ResourceRef<"users">): Promise<EntityRecord | undefined>;
}

export const userCache = async (): Promise<UserCache> => {
  const cache = new Map<ResourceRef<"users">, EntityRecord>();
  const { entity } = await database();

  return {
    getUser: async (userRef) => {
      let user = cache.get(userRef);
      if (user) {
        return user;
      }
      user = await entity.get(userRef);
      if (!user) {
        return undefined;
      }
      cache.set(userRef, user);
      return user;
    },
  };
};
