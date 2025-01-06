import { notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import type {
  MutationResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const deleteInvitation: NonNullable<
  MutationResolvers["deleteInvitation"]
> = async (_parent, _arg, ctx) => {
  const { invitation } = await database();
  const invitationToDelete = await invitation.get(_arg.pk, _arg.sk);
  if (!invitationToDelete) {
    throw notFound("Invitation not found");
  }
  await ensureAuthorized(ctx, invitationToDelete.pk, PERMISSION_LEVELS.OWNER);
  return invitation.delete(
    invitationToDelete.pk,
    invitationToDelete.sk
  ) as unknown as ResolversTypes["Invitation"];
};
