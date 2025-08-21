import { notFound, badRequest } from "@hapi/boom";

import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database } from "@/tables";
import { resourceRef } from "@/utils";

export const updateMe: NonNullable<MutationResolvers["updateMe"]> = async (
  _parent,
  args,
  ctx
) => {
  const session = await requireSession(ctx);
  const userId = session.user?.id;
  if (!userId) {
    throw notFound(i18n._("User not found"));
  }
  const { entity } = await database();
  const user = await entity.get(resourceRef("users", userId));
  if (!user) {
    throw notFound(i18n._("User not found"));
  }
  const name = args.input.name;
  if (!name) {
    throw badRequest(i18n._("Name is required"));
  }
  const updatedUser = await entity.upsert({
    ...user,
    name,
  });
  return updatedUser as unknown as User;
};
