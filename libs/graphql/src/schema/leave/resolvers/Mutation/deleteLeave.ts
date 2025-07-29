import { database } from "@/tables";
import { notFound, forbidden } from "@hapi/boom";
import type { MutationResolvers } from "./../../../../types.generated";
import { requireSession } from "libs/graphql/src/session/requireSession";
import { i18n } from "@/locales";

export const deleteLeave: NonNullable<
  MutationResolvers["deleteLeave"]
> = async (_parent, _arg, _ctx) => {
  const user = await requireSession(_ctx);
  const { leave } = await database();
  const leaveToDelete = await leave.get(_arg.input.pk);
  if (!leaveToDelete) {
    throw notFound(i18n._("Leave not found"));
  }
  if (leaveToDelete.createdBy !== user.user?.id) {
    throw forbidden(i18n._("You are not allowed to delete this leave"));
  }
  await leave.delete(leaveToDelete.pk);
  return leaveToDelete;
};
