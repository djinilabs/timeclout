import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  MutationResolvers,
  ResolversTypes,
} from "./../../../../types.generated";

import { createInvitation as createInvitationLogic } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export async function createHash(message: string) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}

export const createInvitation: NonNullable<
  MutationResolvers["createInvitation"]
> = async (_parent, argument, context) => {
  const actingUserPk = await ensureAuthorized(
    context,
    getResourceRef(argument.toEntityPk),
    PERMISSION_LEVELS.WRITE
  );
  return createInvitationLogic({
    toEntityPk: getResourceRef(argument.toEntityPk),
    invitedUserEmail: argument.invitedUserEmail,
    permissionType: argument.permissionType,
    actingUserPk: actingUserPk,
    origin: context.event.headers["origin"],
  }) as unknown as ResolversTypes["Invitation"];
};
