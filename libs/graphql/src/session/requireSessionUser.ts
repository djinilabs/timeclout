import { unauthorized } from "@hapi/boom";

import { ResolverContext } from "../resolverContext";

import { requireSession } from "./requireSession";

import { database } from "@/tables";
import { resourceRef } from "@/utils";


export const requireSessionUser = async (context: ResolverContext) => {
  const session = await requireSession(context);
  if (!session.user?.id) {
    throw unauthorized();
  }
  const { entity } = await database();
  const user = await entity.get(resourceRef("users", session.user.id));
  if (!user) {
    throw unauthorized();
  }
  return user;
};
