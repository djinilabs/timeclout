import { PERMISSION_LEVELS, resourceRef } from "@/tables";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type { QueryResolvers, Unit } from "./../../../../types.generated";

export const unit: NonNullable<QueryResolvers['unit']> = async (
  _parent,
  arg,
  _ctx
) => {
  const unitPk = resourceRef("units", arg.unitPk);
  await ensureAuthorized(_ctx, unitPk, PERMISSION_LEVELS.READ);

  const { entity } = await database();
  const unit = await entity.get(unitPk);
  if (!unit) {
    throw notFound("Unit not found");
  }
  return unit as unknown as Unit;
};
