import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { Unit, QueryResolvers } from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const unit: NonNullable<QueryResolvers["unit"]> = async (
  _parent,
  argument,
  context
) => {
  await ensureAuthorized(
    context,
    resourceRef("units", argument.unitPk),
    PERMISSION_LEVELS.READ
  );
  const { entity } = await database();
  const unit = await entity.get(resourceRef("units", argument.unitPk));
  if (!unit) {
    throw notFound(i18n._("Unit not found"));
  }
  return unit as unknown as Unit;
};
