import { requireSession } from "libs/graphql/src/session/requireSession";

import type {
  QueryResolvers,
  ResolversTypes,
} from "./../../../../types.generated";

import { database } from "@/tables";
import { getDefined } from "@/utils";

export const myInvitations: NonNullable<
  QueryResolvers["myInvitations"]
> = async (_parent, _argument, context) => {
  const session = await requireSession(context);

  const { invitation } = await database();
  const result = await invitation.query({
    KeyConditionExpression: "sk = :sk",
    ExpressionAttributeValues: {
      ":sk": getDefined(session.user?.email),
    },
  });
  return result.items as unknown as ResolversTypes["Invitation"][];
};
