import { database } from "@/tables";
import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { requireSession } from "libs/graphql/src/session/requireSession";
import { getDefined } from "@/utils";

export const myInvitations: NonNullable<
  QueryResolvers["myInvitations"]
> = async (_parent, _arg, ctx) => {
  const session = await requireSession(ctx);

  const { invitation } = await database();
  return invitation.query({
    KeyConditionExpression: "sk = :sk",
    ExpressionAttributeValues: {
      ":sk": getDefined(session.user.email),
    },
  }) as unknown as ResolversTypes["Invitation"][];
};
