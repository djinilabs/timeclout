import { notFound } from "@hapi/boom";

import { ensureAuthorization } from "../auth/ensureAuthorization";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef , getDefined } from "@/utils";

export interface AcceptInvitationArgs {
  user: {
    pk: string;
    email: string;
  };
  secret: string;
}

export const acceptInvitation = async ({
  user,
  secret,
}: AcceptInvitationArgs) => {
  const { invitation, entity } = await database();
  const { items: invitations } = await invitation.query({
    IndexName: "bySecret",
    KeyConditionExpression: "secret = :secret",
    ExpressionAttributeValues: {
      ":secret": secret,
    },
  });

  if (invitations.length === 0) {
    throw notFound(i18n._("Invitation not found"));
  }

  const userInvitation = getDefined(invitations[0]);

  if (userInvitation.sk !== user.email) {
    throw notFound(i18n._("Invitation not found"));
  }

  // ensure user has permissions to the team
  const team = await entity.get(userInvitation.pk);
  if (!team) {
    throw notFound(i18n._("Team not found"));
  }

  const userPk = resourceRef("users", user.pk);

  // get unit the team belongs to
  const unit = await entity.get(
    getDefined(team.parentPk, "Team parent PK is required")
  );

  if (!unit) {
    throw notFound(i18n._("Unit not found"));
  }

  // get the company the unit belongs to
  const company = await entity.get(
    getDefined(unit.parentPk, "Unit parent PK is required")
  );
  if (!company) {
    throw notFound(i18n._("Company not found"));
  }

  // ensure user has permissions to the company
  await ensureAuthorization(
    company.pk,
    userPk,
    PERMISSION_LEVELS.READ,
    userInvitation.createdBy ?? userPk
  );

  // ensure user has permissions to the unit
  await ensureAuthorization(
    unit.pk,
    userPk,
    PERMISSION_LEVELS.READ,
    userInvitation.createdBy ?? userPk,
    company.pk
  );

  // ensure user has permissions to the team
  await ensureAuthorization(
    team.pk,
    userPk,
    userInvitation.permissionType,
    userInvitation.createdBy ?? userPk,
    unit.pk
  );

  // delete invitation
  await invitation.delete(userInvitation.pk, userInvitation.sk);

  return userInvitation;
};
