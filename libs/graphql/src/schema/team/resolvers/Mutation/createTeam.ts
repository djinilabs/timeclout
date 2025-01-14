import type { MutationResolvers, Team } from "./../../../../types.generated";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { nanoid } from "nanoid";
import { giveAuthorization } from "../../../../auth/giveAuthorization";

export const createTeam: NonNullable<MutationResolvers["createTeam"]> = async (
  _parent,
  arg,
  _ctx
) => {
  const unitRef = resourceRef("units", arg.unitPk);
  const userRef = await ensureAuthorized(
    _ctx,
    unitRef,
    PERMISSION_LEVELS.WRITE
  );
  const { entity } = await database();
  const unit = await entity.get(unitRef);
  if (!unit) {
    throw notFound("Unit with pk ${arg.unitPk} not found");
  }
  const teamPk = resourceRef("teams", nanoid());
  const team = {
    pk: teamPk,
    parentPk: unitRef,
    createdBy: userRef,
    createdAt: new Date().toISOString(),
    name: arg.name,
  };
  await entity.create(team);

  await giveAuthorization(
    teamPk,
    userRef,
    PERMISSION_LEVELS.OWNER,
    userRef,
    unitRef
  );
  return team as unknown as Team;
};
