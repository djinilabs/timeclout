import { unauthorized } from "@hapi/boom";
import { ResolverContext } from "../resolverContext";
import { getSession } from "./getSession";

export const requireSession = async (ctx: ResolverContext) => {
  const session = await getSession(ctx);
  if (!session) {
    throw unauthorized();
  }
  return session;
};
