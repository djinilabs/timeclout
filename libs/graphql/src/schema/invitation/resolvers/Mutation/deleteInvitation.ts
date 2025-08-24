import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  MutationResolvers,
  ResolversTypes,
} from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export const deleteInvitation: NonNullable<MutationResolvers['deleteInvitation']> = async (_parent, _argument, context) => {
  const { invitation } = await database();
  const invitationToDelete = await invitation.get(_argument.pk, _argument.sk);
  if (!invitationToDelete) {
    throw notFound("Invitation not found");
  }
  await ensureAuthorized(
    context,
    getResourceRef(invitationToDelete.pk),
    PERMISSION_LEVELS.OWNER
  );
  return invitation.delete(
    invitationToDelete.pk,
    invitationToDelete.sk
  ) as unknown as ResolversTypes["Invitation"];
};
