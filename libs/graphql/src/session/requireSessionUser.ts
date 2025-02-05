import { database } from "@/tables";
import { resourceRef } from "@/utils";
import { requireSession } from "./requireSession";
import { unauthorized } from "@hapi/boom";
import { ResolverContext } from "../resolverContext";

export const requireSessionUser = async (ctx: ResolverContext) => {
  const session = await requireSession(ctx);
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
