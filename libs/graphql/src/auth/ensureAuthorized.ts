import { forbidden } from "@hapi/boom";

import { ResolverContext } from "../resolverContext";

import { isAuthorized } from "./isAuthorized";

import { i18n } from "@/locales";
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
    console.trace(
      `User does not have permission of level ${minimumPermission} to access this resouce (${resource})`
    );
    throw forbidden(
      i18n.t(
        "User does not have permission of level {minimumPermission} to access this resource ({resource})",
        { minimumPermission, resource }
      )
    );
  }

  return userPk;
};
