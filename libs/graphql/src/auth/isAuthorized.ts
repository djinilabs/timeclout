import { ResolverContext } from "../resolverContext";
import { requireSession } from "../session/requireSession";

import { isUserAuthorized } from "@/business-logic";
import { getDefined, ResourceRef, resourceRef } from "@/utils";

export type IsAuthorizedResult = [false] | [true, ResourceRef<"users">, number];

export const isAuthorized = async (
  ctx: ResolverContext,
  resource: ResourceRef,
  minimumPermission: number
): Promise<IsAuthorizedResult> => {
  const session = await requireSession(ctx);
  const userRef = resourceRef(
    "users",
    getDefined(session.user?.id, "User ID is required")
  );

  return isUserAuthorized(userRef, resource, minimumPermission);
};
