import { database, resourceRef } from "@/tables";
import { requireSession } from "../session/requireSession";
import { forbidden } from "@hapi/boom";
import { ResolverContext } from "../resolverContext";
import { isAuthorized } from "./isAuthorized";

export const ensureAuthorized = async (
  ctx: ResolverContext,
  resource: string,
  minimumPermission: number
): Promise<string> => {
  const [authorized, userPk] = await isAuthorized(
    ctx,
    resource,
    minimumPermission
  );
  if (!authorized) {
    throw forbidden(
      `User does not have permission to access this resouce (${resource})`
    );
  }

  return userPk;
};
