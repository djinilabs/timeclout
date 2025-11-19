import { badRequest, notFound } from "@hapi/boom";

import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { settingsTypes } from "@/settings";
import { database } from "@/tables";
import { resourceRef } from "@/utils";

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
  if (!(args.name in settingsTypes)) {
    throw badRequest("Invalid settings name");
  }
  const settings =
    settingsTypes[args.name as keyof typeof settingsTypes].parse(args.settings);
  await entity_settings.upsert({
    pk: userRef,
    sk: args.name,
    settings,
    createdAt: new Date().toISOString(),
    createdBy: userRef,
    updatedAt: new Date().toISOString(),
    updatedBy: userRef,
  });
  return user as unknown as User;
};
