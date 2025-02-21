import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import { giveAuthorization } from "@/business-logic";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type { MutationResolvers, Unit } from "./../../../../types.generated";

export const createUnit: NonNullable<MutationResolvers["createUnit"]> = async (
  _parent,
  arg,
  _ctx
) => {
  const companyPk = resourceRef("companies", arg.companyPk);
  const userPk = await ensureAuthorized(
    _ctx,
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
    name: arg.name,
  };
  await entity.create(unit);

  await giveAuthorization(
    unitPk,
    userPk,
    PERMISSION_LEVELS.WRITE,
    userPk,
    companyPk
  );

  return unit as unknown as Unit;
};
