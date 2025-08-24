import { unauthorized } from "@hapi/boom";

import { ResolverContext } from "../resolverContext";

import { getSession } from "./getSession";

export const requireSession = async (context: ResolverContext) => {
  const session = await getSession(context);
  if (!session) {
    throw unauthorized();
  }
  return session;
};
