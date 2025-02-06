import { database } from "@/tables";
import { requireSession } from "../../../../session/requireSession";
import type { QueryResolvers, User } from "./../../../../types.generated";
import { notFound } from "@hapi/boom";
import { resourceRef } from "@/utils";

export const me: NonNullable<QueryResolvers['me']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const session = await requireSession(_ctx);
  const userId = session.user?.id;
  if (!userId) {
    throw notFound("User not found");
  }
  const { entity } = await database();
  const user = await entity.get(resourceRef("users", userId));
  if (!user) {
    throw notFound("User not found");
  }
  return user as unknown as User;
};
