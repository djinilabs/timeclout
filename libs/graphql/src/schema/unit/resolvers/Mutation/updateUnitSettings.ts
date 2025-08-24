import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Unit } from "./../../../../types.generated";

import { updateEntitySettings } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";


export const updateUnitSettings: NonNullable<MutationResolvers['updateUnitSettings']> = async (_parent, argument, context) => {
  const unitReference = resourceRef("units", argument.unitPk);
  const userPk = await ensureAuthorized(context, unitReference, PERMISSION_LEVELS.WRITE);
  return updateEntitySettings(
    unitReference,
    argument.name,
    argument.settings,
    userPk
  ) as unknown as Promise<Unit>;
};
