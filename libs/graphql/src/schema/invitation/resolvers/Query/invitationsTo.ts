import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export const invitationsTo: NonNullable<
  QueryResolvers["invitationsTo"]
> = async (_parent, arg, ctx) => {
  await ensureAuthorized(
    ctx,
    getResourceRef(arg.toEntityPk),
    PERMISSION_LEVELS.READ
  );
  const { invitation } = await database();
  const invitations = (
    await invitation.query({
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": arg.toEntityPk,
      },
    })
  ).items as unknown as ResolversTypes["Invitation"][];
  return invitations;
};
