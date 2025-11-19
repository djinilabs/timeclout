import { forbidden, notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { isUserAuthorized } from "@/business-logic";
import { settingsTypes } from "@/settings";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const updateUserSettings: NonNullable<MutationResolvers['updateUserSettings']> = async (_parent, args, ctx) => {
  const teamPk = resourceRef("teams", args.teamPk);
  const userPk = await ensureAuthorized(ctx, teamPk, PERMISSION_LEVELS.WRITE);
  const { entity, entity_settings } = await database();
  const userRef = resourceRef("users", args.userPk);
  const [isAuthorized] = await isUserAuthorized(
    userRef,
    teamPk,
    PERMISSION_LEVELS.READ
  );
  if (!isAuthorized) {
    throw forbidden("User is not in the team");
  }
  const user = await entity.get(userRef);
  if (!user) {
    throw notFound("User not found");
  }
  const settings =
    settingsTypes[args.name as keyof typeof settingsTypes].parse(args.settings);
  await entity_settings.upsert({
    pk: userRef,
    sk: args.name,
    settings,
    createdAt: new Date().toISOString(),
    createdBy: userPk,
    updatedAt: new Date().toISOString(),
    updatedBy: userPk,
  });
  console.log("user", user);
  return user as unknown as User;
};
