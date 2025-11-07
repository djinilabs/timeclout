import { APIGatewayProxyEventV2, Context } from "aws-lambda";

import { database, EntityRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export interface UserCache {
  getUser(userRef: ResourceRef<"users">): Promise<EntityRecord | undefined>;
}

export const createUserCache = async (): Promise<UserCache> => {
  const cache = new Map<ResourceRef<"users">, EntityRecord | undefined>();
  const { entity } = await database();

  return {
    getUser: async (userRef) => {
      if (cache.has(userRef)) {
        return cache.get(userRef);
      }
      const user = await entity.get(userRef);
      cache.set(userRef, user);
      return user;
    },
  };
};

export type ResolverContext = {
  event: APIGatewayProxyEventV2;
  lambdaContext: Context;
  userCache: UserCache;
};
