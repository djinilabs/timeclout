import { forbidden } from "@hapi/boom";
import { ResolverContext } from "../resolverContext";
import { isAuthorized } from "./isAuthorized";
import { ResourceRef } from "@/utils";

export const ensureAuthorized = async (
  ctx: ResolverContext,
  resource: ResourceRef,
  minimumPermission: number
): Promise<ResourceRef<"users">> => {
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
