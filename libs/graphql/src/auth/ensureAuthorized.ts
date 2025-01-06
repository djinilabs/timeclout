import { database, resourceRef } from "@/tables";
import { requireSession } from "../session/requireSession";
import { forbidden } from "@hapi/boom";
import { ResolverContext } from "../resolverContext";

export const ensureAuthorized = async (
  ctx: ResolverContext,
  resource: string,
  minimumPermission: number
): Promise<string> => {
  const session = await requireSession(ctx);
  const userPk = resourceRef("users", session.user.id);

  const { permission } = await database();
  const permissionRecord = await permission.get(resource, userPk);
  if (!permissionRecord || permissionRecord.type < minimumPermission) {
    throw forbidden("User does not have permission to access this resouce");
  }

  return userPk;
};
