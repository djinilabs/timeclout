import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Unit } from "./../../../../types.generated";

import { PERMISSION_LEVELS , database } from "@/tables";
import { resourceRef } from "@/utils";

export const updateUnit: NonNullable<MutationResolvers['updateUnit']> = async (
  _parent,
  _argument,
  _context
) => {
  const unitPk = resourceRef("units", _argument.pk);
  await ensureAuthorized(_context, unitPk, PERMISSION_LEVELS.WRITE);

  const { entity } = await database();
  const unit = await entity.get(resourceRef("units", _argument.pk));
  if (!unit) {
    throw notFound("Unit with pk ${_arg.pk} not found");
  }

  unit.name = _argument.name;
  await entity.update(unit);

  return unit as unknown as Unit;
};
