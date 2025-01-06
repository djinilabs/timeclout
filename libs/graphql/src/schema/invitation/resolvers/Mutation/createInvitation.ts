import { notFound } from "@hapi/boom";
import type {
  Invitation,
  MutationResolvers,
  ResolversTypes,
  ResolversUnionTypes,
} from "./../../../../types.generated";
import { database, PERMISSION_LEVELS } from "@/tables";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const createInvitation: NonNullable<
  MutationResolvers["createInvitation"]
> = async (_parent, arg, ctx) => {
  const actingUserPk = await ensureAuthorized(
    ctx,
    arg.toEntityPk,
    PERMISSION_LEVELS.OWNER
  );
  const { entity, invitation } = await database();
  const invitedTo = await entity.get(arg.toEntityPk);
  if (!invitedTo) {
    throw notFound("Invited to entity not found");
  }
  return invitation.create({
    pk: invitedTo.pk,
    sk: arg.invitedUserPk,
    permissionType: arg.permissionType,
    createdBy: actingUserPk,
    createdAt: new Date().toISOString(),
  }) as unknown as ResolversTypes["Invitation"];
};
