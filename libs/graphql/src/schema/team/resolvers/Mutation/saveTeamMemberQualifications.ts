import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { updateCompoundEntitySettings } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef, compoundedResourceRef, getResourceRef } from "@/utils";



export const saveTeamMemberQualifications: NonNullable<
  MutationResolvers["saveTeamMemberQualifications"]
> = async (_parent, argument, context) => {
  const teamReference = resourceRef("teams", argument.teamPk);
  const { entity } = await database();
  const team = await entity.get(teamReference);
  if (!team) {
    throw notFound("Team not found");
  }
  const userPk = await ensureAuthorized(context, teamReference, PERMISSION_LEVELS.WRITE);
  const userInTeamReference = compoundedResourceRef(
    teamReference,
    getResourceRef(argument.userPk, "users")
  );
  await updateCompoundEntitySettings(
    userInTeamReference,
    "userQualifications",
    argument.qualifications,
    userPk
  );

  return team as unknown as Team;
};
