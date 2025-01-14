import { database } from "@/tables";
import { getDefined, ResourceRef, resourceRef } from "@/utils";
import { ResolverContext } from "../resolverContext";
import { requireSession } from "../session/requireSession";

export type IsAuthorizedResult = [false] | [true, ResourceRef];

export const isAuthorized = async (
  ctx: ResolverContext,
  resource: string,
  minimumPermission: number
): Promise<IsAuthorizedResult> => {
  const session = await requireSession(ctx);
  const userPk = resourceRef(
    "users",
    getDefined(session.user?.id, "User ID is required")
  );

  const { permission } = await database();
  const permissionRecord = await permission.get(resource, userPk);
  if (!permissionRecord || permissionRecord.type < minimumPermission) {
    return [false];
  }
  return [true, userPk];
};
