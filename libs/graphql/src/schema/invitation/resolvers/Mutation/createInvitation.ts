import { createInvitation as createInvitationLogic } from "@/business-logic";
import type {
  MutationResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export async function createHash(message: string) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}

export const createInvitation: NonNullable<MutationResolvers['createInvitation']> = async (_parent, arg, ctx) => {
  const actingUserPk = await ensureAuthorized(
    ctx,
    getResourceRef(arg.toEntityPk),
    PERMISSION_LEVELS.WRITE
  );
  return createInvitationLogic({
    toEntityPk: arg.toEntityPk,
    invitedUserEmail: arg.invitedUserEmail,
    permissionType: arg.permissionType,
    actingUserPk: actingUserPk,
    origin: ctx.event.headers["origin"],
  }) as unknown as ResolversTypes["Invitation"];
};
