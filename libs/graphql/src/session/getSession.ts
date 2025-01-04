import { getSession as getExpressSession } from "@auth/express";
import { ResolverContext } from "../resolverContext";
import { authConfig } from "@/auth-config";

export const getSession = async (ctx: ResolverContext) => {
  return getExpressSession(ctx.event, await authConfig());
};
