import { APIGatewayProxyEventV2, Context } from "aws-lambda";

import { database, EntityRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export interface UserCache {
  getUser(userReference: ResourceRef<"users">): Promise<EntityRecord | undefined>;
}

export const createUserCache = async (): Promise<UserCache> => {
  const cache = new Map<ResourceRef<"users">, EntityRecord | undefined>();
  const { entity } = await database();

  return {
    getUser: async (userReference) => {
      if (cache.has(userReference)) {
        return cache.get(userReference);
      }
      const user = await entity.get(userReference);
      cache.set(userReference, user);
      return user;
    },
  };
};

export type ResolverContext = {
  event: APIGatewayProxyEventV2;
  lambdaContext: Context;
  userCache: UserCache;
};
