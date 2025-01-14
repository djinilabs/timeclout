import { notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type { MutationResolvers, Unit } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const updateUnitSettings: NonNullable<
  MutationResolvers["updateUnitSettings"]
> = async (_parent, arg, ctx) => {
  console.log("updateUnitSettings", arg);
  const unitRef = resourceRef("units", arg.unitPk);
  const userPk = await ensureAuthorized(ctx, unitRef, PERMISSION_LEVELS.WRITE);
  const { entity, entity_settings } = await database();
  const unit = await entity.get(unitRef);
  if (!unit) {
    throw notFound(`Unit with pk ${arg.unitPk} not found`);
  }
  await entity_settings.upsert({
    pk: unitRef,
    sk: arg.name,
    settings: arg.settings,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    updatedBy: userPk,
    updatedAt: new Date().toISOString(),
  });
  return unit as unknown as Unit;
};
