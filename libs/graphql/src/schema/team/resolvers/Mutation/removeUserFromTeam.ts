import { notFound, notAcceptable } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { database , PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";

export const removeUserFromTeam: NonNullable<
  MutationResolvers["removeUserFromTeam"]
> = async (_parent, argument, context) => {
  const teamReference = resourceRef("teams", argument.teamPk);
  const actorUserPk = await ensureAuthorized(
    context,
    teamReference,
    PERMISSION_LEVELS.WRITE
  );
  if (actorUserPk === argument.userPk) {
    throw notAcceptable("You cannot remove yourself from the team");
  }
  const { entity, permission } = await database();
  const team = await entity.get(teamReference);
  if (!team) {
    throw notFound("Team not found");
  }
  await permission.deleteIfExists(teamReference, argument.userPk);

  const unitPk = getDefined(team.parentPk, "Team must have a parent unit");

  // Get all teams in the unit to check if user belongs to any other team
  const { items: teamsInUnit } = await entity.query({
    IndexName: "byParentPk",
    KeyConditionExpression: "parentPk = :parentPk",
    ExpressionAttributeValues: {
      ":parentPk": unitPk,
    },
  });

  // Check if user belongs to any other team in the unit
  let userBelongsToOtherTeam = false;
  for (const otherTeam of teamsInUnit) {
    if (otherTeam.pk === teamReference) {
      continue; // Skip the team we're removing from
    }
    const hasPermission = await permission.get(otherTeam.pk, argument.userPk);
    if (hasPermission) {
      userBelongsToOtherTeam = true;
      break;
    }
  }

  // If user doesn't belong to other teams, remove unit permission
  if (!userBelongsToOtherTeam) {
    await permission.deleteIfExists(unitPk, argument.userPk);

    // Remove user from the unit's company if and only if they are not a member of any other unit in the company
    const unit = await entity.get(unitPk);
    const company = await entity.get(
      getDefined(unit?.parentPk, "Unit must have a parent company")
    );
    if (company) {
      const { items: unitsInCompany } = await entity.query({
        IndexName: "byParentPk",
        KeyConditionExpression: "parentPk = :parentPk",
        ExpressionAttributeValues: {
          ":parentPk": company.pk,
        },
      });
      let userBelongsToOtherUnit = false;
      for (const otherUnit of unitsInCompany) {
        if (otherUnit.pk === unitPk) {
          continue; // Skip the unit we're removing from
        }
        const hasPermission = await permission.get(otherUnit.pk, argument.userPk);
        if (hasPermission) {
          userBelongsToOtherUnit = true;
          break;
        }
      }
      if (!userBelongsToOtherUnit) {
        await permission.deleteIfExists(company.pk, argument.userPk);
      }
    }
  }

  return team as unknown as Team;
};
