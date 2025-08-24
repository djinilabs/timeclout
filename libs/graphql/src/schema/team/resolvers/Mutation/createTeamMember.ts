import { conflict, notFound } from "@hapi/boom";
import { nanoid } from "nanoid";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers, User } from "./../../../../types.generated";

import {
  ensureAuthorization,
  getUserAuthorizationLevelForResource,
} from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";



export const createTeamMember: NonNullable<
  MutationResolvers["createTeamMember"]
> = async (_parent, { input }, context) => {
  const teamReference = resourceRef("teams", input.teamPk);
  // ensure user has write access to team
  await ensureAuthorized(context, teamReference, PERMISSION_LEVELS.WRITE);
  const session = await requireSession(context);
  const createdByPk = session.user?.id;
  if (!createdByPk) {
    throw notFound("User not found");
  }
  const createdBy = resourceRef("users", createdByPk);

  const { entity } = await database();

  const team = await entity.get(teamReference);
  if (!team) {
    throw notFound("Team not found");
  }

  const tables = await database();
  let userPk;
  const authResult = await tables["next-auth"].query({
    KeyConditionExpression: "pk = :pk and sk = :sk",
    ExpressionAttributeValues: {
      ":pk": `USER#${input.email}`,
      ":sk": `USER#${input.email}`,
    },
  });
  const authUser = authResult.items[0];
  if (authUser) {
    userPk = authUser.id;
  } else {
    userPk = nanoid();
    await tables["next-auth"].create({
      pk: `USER#${input.email}`,
      sk: `USER#${input.email}`,
      email: input.email,
      name: input.name,
      id: userPk,
      createdBy,
    });
  }

  const userReference = resourceRef("users", userPk);

  const userHasAccessToTeam = await getUserAuthorizationLevelForResource(
    resourceRef("teams", team.pk),
    userReference
  );
  if (userHasAccessToTeam) {
    throw conflict("User already is a member of the team");
  }

  let systemUser = await tables.entity.get(userReference);
  if (!systemUser) {
    systemUser = {
      pk: userReference,
      name: input.name,
      email: input.email,
      createdBy,
      version: 0,
      createdAt: new Date().toISOString(),
    };
    await entity.create(systemUser);
  }

  const unit = await entity.get(
    getDefined(team.parentPk, "Team parent PK is required")
  );

  if (!unit) {
    throw notFound("Unit not found");
  }

  // get the company the unit belongs to
  const company = await entity.get(
    getDefined(unit.parentPk, "Unit parent PK is required")
  );
  if (!company) {
    throw notFound("Company not found");
  }

  // ensure user has permissions to the company
  await ensureAuthorization(
    company.pk,
    userReference,
    PERMISSION_LEVELS.READ,
    createdBy
  );

  // ensure user has permissions to the unit
  await ensureAuthorization(
    unit.pk,
    userReference,
    PERMISSION_LEVELS.READ,
    createdBy,
    company.pk
  );

  // ensure user has permissions to the team
  await ensureAuthorization(
    team.pk,
    userReference,
    input.permission,
    createdBy,
    unit.pk
  );

  return systemUser as unknown as User;
};
