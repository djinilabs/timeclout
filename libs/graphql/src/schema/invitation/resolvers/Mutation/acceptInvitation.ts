import { notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type {
  MutationResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { ensureAuthorization } from "../../../../auth/ensureAuthorization";
import { getDefined } from "@/utils";

export const acceptInvitation: NonNullable<MutationResolvers['acceptInvitation']> = async (_parent, arg, ctx) => {
  const session = await requireSession(ctx);
  const { invitation, entity } = await database();
  const invitations = await invitation.query({
    IndexName: "bySecret",
    KeyConditionExpression: "secret = :secret",
    ExpressionAttributeValues: {
      ":secret": arg.secret,
    },
  });

  if (invitations.length === 0) {
    throw notFound("Invitation not found");
  }

  const userInvitation = getDefined(invitations[0]);

  if (
    userInvitation.sk !==
    getDefined(session.user?.email, "User email is required")
  ) {
    throw notFound("Invitation not found");
  }

  // ensure user has permissions to the team
  const team = await entity.get(userInvitation.pk);
  if (!team) {
    throw notFound("Team not found");
  }

  const userPk = resourceRef(
    "users",
    getDefined(session.user?.id, "User ID is required")
  );

  // get unit the team belongs to
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
    userPk,
    PERMISSION_LEVELS.READ,
    userInvitation.createdBy
  );

  // ensure user has permissions to the unit
  await ensureAuthorization(
    unit.pk,
    userPk,
    PERMISSION_LEVELS.READ,
    userInvitation.createdBy,
    company.pk
  );

  // ensure user has permissions to the team
  await ensureAuthorization(
    team.pk,
    userPk,
    userInvitation.permissionType,
    userInvitation.createdBy,
    unit.pk
  );

  // delete invitation
  await invitation.delete(userInvitation.pk, userInvitation.sk);

  return userInvitation as unknown as Promise<ResolversTypes["Invitation"]>;
};
