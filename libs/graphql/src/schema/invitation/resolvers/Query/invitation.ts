import { forbidden, notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { isAuthorized } from "../../../../auth/isAuthorized";
import { getDefined, getResourceRef } from "@/utils";

export const invitation: NonNullable<QueryResolvers['invitation']> = async (
  _parent,
  _arg,
  ctx
) => {
  const { invitation } = await database();
  const invitations = await invitation.query({
    IndexName: "bySecret",
    KeyConditionExpression: "secret = :secret",
    ExpressionAttributeValues: {
      ":secret": _arg.secret,
    },
  });
  if (invitations.length === 0) {
    throw notFound("Invitation not found");
  }
  const invitationToGet = getDefined(invitations[0]);
  const user = await requireSession(ctx);
  if (
    user.user?.email === invitationToGet.sk ||
    (
      await isAuthorized(
        ctx,
        getResourceRef(invitationToGet.sk),
        PERMISSION_LEVELS.READ
      )
    )[0]
  ) {
    return invitationToGet as unknown as ResolversTypes["Invitation"];
  }
  throw forbidden(
    `User does not have permission to access this resouce (${invitationToGet.sk})`
  );
};
