import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Unit } from "./../../../../types.generated";

import { updateEntitySettings } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";


export const updateUnitSettings: NonNullable<MutationResolvers['updateUnitSettings']> = async (_parent, arg, ctx) => {
  const unitRef = resourceRef("units", arg.unitPk);
  const userPk = await ensureAuthorized(ctx, unitRef, PERMISSION_LEVELS.WRITE);
  return updateEntitySettings(
    unitRef,
    arg.name,
    arg.settings,
    userPk
  ) as unknown as Promise<Unit>;
};
