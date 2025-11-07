import { forbidden, notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { isUserAuthorized, ensureExactAuthorization } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const updateTeamMember: NonNullable<MutationResolvers['updateTeamMember']> = async (_parent, { input }, ctx) => {
  const teamRef = resourceRef("teams", input.teamPk);
  // ensure user has write access to team
  await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);
  const session = await requireSession(ctx);
  const createdByPk = session.user?.id;
  if (!createdByPk) {
    throw notFound("User not found");
  }
  const updatedBy = resourceRef("users", createdByPk);
  const userRef = resourceRef("users", input.memberPk);

  const { entity } = await database();
  if (!(await isUserAuthorized(userRef, teamRef, PERMISSION_LEVELS.READ))) {
    throw forbidden("User is not a member of this team");
  }

  // Get the existing user data to preserve required fields
  const existingUser = await entity.get(userRef);
  if (!existingUser) {
    throw notFound("User not found in database");
  }

  // Update our application user entity
  const updatedUser = await entity.upsert({
    ...existingUser,
    name: input.name,
    email: input.email,
    updatedBy,
  });

  // Also update the NextAuth user record
  const { "next-auth": nextAuthTable } = await database();
  try {
    // Find the NextAuth user record by user ID
    const nextAuthUser = await nextAuthTable.get(
      `USER#${input.memberPk}`,
      `USER#${input.memberPk}`
    );

    if (nextAuthUser) {
      // Update the NextAuth user record
      await nextAuthTable.upsert({
        ...nextAuthUser,
        name: input.name,
        email: input.email,
      });
    }
  } catch (error) {
    // Log the error but don't fail the operation since the main user entity was updated
    console.warn("Failed to update NextAuth user record:", error);
  }

  await ensureExactAuthorization(teamRef, userRef, input.permission, updatedBy);

  return updatedUser as unknown as User;
};
