import { PERMISSION_LEVELS, resourceRef } from "@/tables";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type { MutationResolvers, Unit } from "./../../../../types.generated";

export const deleteUnit: NonNullable<MutationResolvers["deleteUnit"]> = async (
  _parent,
  _arg,
  _ctx
) => {
  const unitPk = resourceRef("units", _arg.pk);
  await ensureAuthorized(_ctx, unitPk, PERMISSION_LEVELS.OWNER);

  const { entity, permission } = await database();
  const unit = await entity.get(unitPk);
  if (!unit) {
    throw notFound("Unit with pk ${_arg.pk} not found");
  }

  await entity.delete(unitPk);
  await permission.deleteAll(unitPk);

  return unit as unknown as Unit;
};
