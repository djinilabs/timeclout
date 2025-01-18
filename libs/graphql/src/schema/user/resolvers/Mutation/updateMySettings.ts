import { notFound } from "@hapi/boom";
import type { MutationResolvers, User } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { database } from "@/tables";
import { resourceRef } from "@/utils";

export const updateMySettings: NonNullable<MutationResolvers['updateMySettings']> = async (_parent, args, ctx) => {
  const session = await requireSession(ctx);
  const userId = session.user?.id;
  if (!userId) {
    throw notFound("User not found");
  }
  const { entity_settings } = await database();
  const userRef = resourceRef("users", userId);
  const user = await entity_settings.upsert({
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
