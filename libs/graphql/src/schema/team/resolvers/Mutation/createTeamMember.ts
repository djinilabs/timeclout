import { nanoid } from "nanoid";
import { notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
import { authConfig } from "@/auth-config";
import { ensureAuthorization } from "@/business-logic";
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

  const auth = await authConfig();
  const userPk = nanoid();
  await getDefined(auth.adapter?.createUser)({
    id: userPk,
    email: input.email,
    name: input.name,
    emailVerified: null,
  });

  const userRef = resourceRef("users", userPk);

  const newUser = {
    pk: userRef,
    name: input.name,
    email: input.email,
    createdBy,
  };
  (await entity.create(newUser)) as unknown as Promise<User>;

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
    PERMISSION_LEVELS.READ,
    createdBy,
    unit.pk
  );

  return newUser as unknown as User;
};
