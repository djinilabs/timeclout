import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { database, PERMISSION_LEVELS } from "@/tables";

export const invitationsTo: NonNullable<QueryResolvers['invitationsTo']> = async (_parent, arg, ctx) => {
  await ensureAuthorized(ctx, arg.toEntityPk, PERMISSION_LEVELS.READ);
  const { invitation } = await database();
  const invitations = (await invitation.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": arg.toEntityPk,
    },
  })) as unknown as ResolversTypes["Invitation"][];
  return invitations;
};
