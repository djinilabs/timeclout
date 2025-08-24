import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { giveAuthorization } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const createTeam: NonNullable<MutationResolvers["createTeam"]> = async (
  _parent,
  argument,
  _context
) => {
  const unitReference = resourceRef("units", argument.unitPk);
  const userReference = await ensureAuthorized(
    _context,
    unitReference,
    PERMISSION_LEVELS.WRITE
  );
  const { entity } = await database();
  const unit = await entity.get(unitReference);
  if (!unit) {
    throw notFound("Unit with pk ${arg.unitPk} not found");
  }
  const teamPk = resourceRef("teams", nanoid());
  const team = {
    pk: teamPk,
    parentPk: unitReference,
    createdBy: userReference,
    createdAt: new Date().toISOString(),
    name: argument.name,
  };
  await entity.create(team);

  await giveAuthorization(
    teamPk,
    userReference,
    PERMISSION_LEVELS.OWNER,
    userReference,
    unitReference
  );
  return team as unknown as Team;
};
