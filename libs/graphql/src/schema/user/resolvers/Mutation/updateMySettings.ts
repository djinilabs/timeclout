import { notFound } from "@hapi/boom";
import { database } from "@/tables";
import { resourceRef } from "@/utils";
import type { MutationResolvers, User } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const updateMySettings: NonNullable<MutationResolvers['updateMySettings']> = async (_parent, args, ctx) => {
  const session = await requireSession(ctx);
  const userId = session.user?.id;
  if (!userId) {
    throw notFound("User not found");
  }
  const { entity, entity_settings } = await database();
  const user = await entity.get(resourceRef("users", userId));
  if (!user) {
    throw notFound("User not found");
  }
  const userRef = resourceRef("users", userId);
  await entity_settings.upsert({
    pk: userRef,
    sk: args.name,
    settings: args.settings,
    createdAt: new Date().toISOString(),
    createdBy: userRef,
    updatedAt: new Date().toISOString(),
    updatedBy: userRef,
  });
  return user as unknown as User;
};
