import { notFound } from "@hapi/boom";

import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { database } from "@/tables";
import { resourceRef } from "@/utils";

export const updateMySettings: NonNullable<MutationResolvers['updateMySettings']> = async (_parent, arguments_, context) => {
  const session = await requireSession(context);
  const userId = session.user?.id;
  if (!userId) {
    throw notFound("User not found");
  }
  const { entity, entity_settings } = await database();
  const user = await entity.get(resourceRef("users", userId));
  if (!user) {
    throw notFound("User not found");
  }
  const userReference = resourceRef("users", userId);
  await entity_settings.upsert({
    pk: userReference,
    sk: arguments_.name,
    settings: arguments_.settings,
    createdAt: new Date().toISOString(),
    createdBy: userReference,
    updatedAt: new Date().toISOString(),
    updatedBy: userReference,
  });
  return user as unknown as User;
};
