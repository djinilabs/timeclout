import { requireSession } from "libs/graphql/src/session/requireSession";

import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";

import { database } from "@/tables";
import { getDefined } from "@/utils";

export const myInvitations: NonNullable<
  QueryResolvers["myInvitations"]
> = async (_parent, _arg, ctx) => {
  const session = await requireSession(ctx);

  const { invitation } = await database();
  return (
    await invitation.query({
      KeyConditionExpression: "sk = :sk",
      ExpressionAttributeValues: {
        ":sk": getDefined(session.user?.email),
      },
    })
  ).items as unknown as ResolversTypes["Invitation"][];
};
