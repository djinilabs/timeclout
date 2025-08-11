import { nanoid } from "nanoid";
import { conflict, notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
import {
  ensureAuthorization,
  getUserAuthorizationLevelForResource,
} from "@/business-logic";
import type { MutationResolvers, User } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { requireSession } from "../../../../session/requireSession";

export const createTeamMember: NonNullable<
  MutationResolvers["createTeamMember"]
> = async (_parent, { input }, ctx) => {
  const teamRef = resourceRef("teams", input.teamPk);
  // ensure user has write access to team
  await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);
  const session = await requireSession(ctx);
  const createdByPk = session.user?.id;
  if (!createdByPk) {
    throw notFound("User not found");
  }
  const createdBy = resourceRef("users", createdByPk);

  const { entity } = await database();

  const team = await entity.get(teamRef);
  if (!team) {
    throw notFound("Team not found");
  }

  const tables = await database();
  let userPk;
  const authUser = (
    await tables["next-auth"].query({
      KeyConditionExpression: "pk = :pk and sk = :sk",
      ExpressionAttributeValues: {
        ":pk": `USER#${input.email}`,
        ":sk": `USER#${input.email}`,
      },
    })
  ).items[0];
  if (!authUser) {
    userPk = nanoid();
    await tables["next-auth"].create({
      pk: `USER#${input.email}`,
      sk: `USER#${input.email}`,
      email: input.email,
      name: input.name,
      id: userPk,
      createdBy,
    });
  } else {
    userPk = authUser.id;
  }

  const userRef = resourceRef("users", userPk);

  const userHasAccessToTeam = await getUserAuthorizationLevelForResource(
    resourceRef("teams", team.pk),
    userRef
  );
  if (userHasAccessToTeam) {
    throw conflict("User already is a member of the team");
  }

  let systemUser = await tables.entity.get(userRef);
  if (!systemUser) {
    systemUser = {
      pk: userRef,
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
    userRef,
    PERMISSION_LEVELS.READ,
    createdBy
  );

  // ensure user has permissions to the unit
  await ensureAuthorization(
    unit.pk,
    userRef,
    PERMISSION_LEVELS.READ,
    createdBy,
    company.pk
  );

  // ensure user has permissions to the team
  await ensureAuthorization(
    team.pk,
    userRef,
    input.permission,
    createdBy,
    unit.pk
  );

  return systemUser as unknown as User;
};
