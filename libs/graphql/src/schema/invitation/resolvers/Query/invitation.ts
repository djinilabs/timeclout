import { forbidden, notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import type {
  Invitation,
  QueryResolvers,
  Resolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { isAuthorized } from "../../../../auth/isAuthorized";

export const invitation: NonNullable<QueryResolvers['invitation']> = async (
  _parent,
  _arg,
  ctx
) => {
  const { invitation } = await database();
  const invitationToGet = await invitation.get(_arg.pk, _arg.sk);
  if (!invitationToGet) {
    throw notFound("Invitation not found");
  }
  const user = await requireSession(ctx);
  if (
    user.user.email === invitationToGet.sk ||
    (await isAuthorized(ctx, invitationToGet.sk, PERMISSION_LEVELS.READ))[0]
  ) {
    return invitationToGet as ResolversTypes["Invitation"];
  }
  throw forbidden("User does not have permission to access this resouce");
};
