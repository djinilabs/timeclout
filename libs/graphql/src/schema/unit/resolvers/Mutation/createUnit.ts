import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Unit } from "./../../../../types.generated";

import { giveAuthorization } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";


export const createUnit: NonNullable<MutationResolvers['createUnit']> = async (
  _parent,
  argument,
  context
) => {
  const companyPk = resourceRef("companies", argument.companyPk);
  const userPk = await ensureAuthorized(
    context,
    companyPk,
    PERMISSION_LEVELS.WRITE
  );
  const { entity } = await database();
  const company = await entity.get(companyPk);
  if (!company) {
    throw notFound("Company with pk ${arg.companyPk} not found");
  }

  const unitPk = resourceRef("units", nanoid());
  const unit = {
    pk: unitPk,
    parentPk: companyPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    name: argument.name,
  };
  await entity.create(unit);

  await giveAuthorization(
    unitPk,
    userPk,
    PERMISSION_LEVELS.OWNER,
    userPk,
    companyPk
  );

  return unit as unknown as Unit;
};
