import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export const invitationsTo: NonNullable<
  QueryResolvers["invitationsTo"]
> = async (_parent, argument, context) => {
  await ensureAuthorized(
    context,
    getResourceRef(argument.toEntityPk),
    PERMISSION_LEVELS.READ
  );
  const { invitation } = await database();
  const result = await invitation.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": argument.toEntityPk,
    },
  });
  const invitations = result.items as unknown as ResolversTypes["Invitation"][];
  return invitations;
};
