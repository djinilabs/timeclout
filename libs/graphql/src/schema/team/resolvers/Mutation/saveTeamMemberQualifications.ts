import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { updateCompoundEntitySettings } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef, compoundedResourceRef, getResourceRef } from "@/utils";



export const saveTeamMemberQualifications: NonNullable<
  MutationResolvers["saveTeamMemberQualifications"]
> = async (_parent, arg, ctx) => {
  const teamRef = resourceRef("teams", arg.teamPk);
  const { entity } = await database();
  const team = await entity.get(teamRef);
  if (!team) {
    throw notFound("Team not found");
  }
  const userPk = await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);
  const userInTeamRef = compoundedResourceRef(
    teamRef,
    getResourceRef(arg.userPk, "users")
  );
  await updateCompoundEntitySettings(
    userInTeamRef,
    "userQualifications",
    arg.qualifications,
    userPk
  );

  return team as unknown as Team;
};
