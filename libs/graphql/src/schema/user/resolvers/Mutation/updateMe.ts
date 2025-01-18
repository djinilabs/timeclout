import { badRequest, notFound } from "@hapi/boom";
import { resourceRef } from "@/utils";
import { database } from "@/tables";
import type { MutationResolvers, User } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const updateMe: NonNullable<MutationResolvers['updateMe']> = async (
  _parent,
  args,
  ctx
) => {
  const session = await requireSession(ctx);
  const userId = session.user?.id;
  if (!userId) {
    throw notFound("User not found");
  }
  const name = args.input.name;
  if (!name) {
    throw badRequest("Name is required");
  }
  const { entity } = await database();
  const userRef = resourceRef("users", userId);
  const user = await entity.update({
    pk: userRef,
    name,
    updatedAt: new Date().toISOString(),
    updatedBy: userRef,
  });
  return user as unknown as User;
};
