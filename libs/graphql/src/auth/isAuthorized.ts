import { database, resourceRef } from "@/tables";
import { ResolverContext } from "../resolverContext";
import { requireSession } from "../session/requireSession";

export type IsAuthorizedResult = [false] | [true, string];

export const isAuthorized = async (
  ctx: ResolverContext,
  resource: string,
  minimumPermission: number
): Promise<IsAuthorizedResult> => {
  const session = await requireSession(ctx);
  const userPk = resourceRef("users", session.user.id);

  const { permission } = await database();
  const permissionRecord = await permission.get(resource, userPk);
  if (!permissionRecord || permissionRecord.type < minimumPermission) {
    return [false];
  }
  return [true, userPk];
};
