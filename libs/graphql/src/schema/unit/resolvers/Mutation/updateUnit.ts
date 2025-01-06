import { PERMISSION_LEVELS, resourceRef } from "@/tables";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type { MutationResolvers, Unit } from "./../../../../types.generated";

export const updateUnit: NonNullable<MutationResolvers["updateUnit"]> = async (
  _parent,
  _arg,
  _ctx
) => {
  const unitPk = resourceRef("units", _arg.pk);
  await ensureAuthorized(_ctx, unitPk, PERMISSION_LEVELS.WRITE);

  const { entity } = await database();
  const unit = await entity.get(resourceRef("units", _arg.pk));
  if (!unit) {
    throw notFound("Unit with pk ${_arg.pk} not found");
  }

  unit.name = _arg.name;
  await entity.update(unit);

  return unit as unknown as Unit;
};
