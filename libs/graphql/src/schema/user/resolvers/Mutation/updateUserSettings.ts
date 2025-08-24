import { forbidden, notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { isUserAuthorized } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const updateUserSettings: NonNullable<MutationResolvers['updateUserSettings']> = async (_parent, arguments_, context) => {
  const teamPk = resourceRef("teams", arguments_.teamPk);
  const userPk = await ensureAuthorized(context, teamPk, PERMISSION_LEVELS.WRITE);
  const { entity, entity_settings } = await database();
  const userReference = resourceRef("users", arguments_.userPk);
  const [isAuthorized] = await isUserAuthorized(
    userReference,
    teamPk,
    PERMISSION_LEVELS.READ
  );
  if (!isAuthorized) {
    throw forbidden("User is not in the team");
  }
  const user = await entity.get(userReference);
  if (!user) {
    throw notFound("User not found");
  }
  await entity_settings.upsert({
    pk: userReference,
    sk: arguments_.name,
    settings: arguments_.settings,
    createdAt: new Date().toISOString(),
    createdBy: userPk,
    updatedAt: new Date().toISOString(),
    updatedBy: userPk,
  });
  console.log("user", user);
  return user as unknown as User;
};
