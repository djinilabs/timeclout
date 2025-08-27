import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers } from "./../../../../types.generated";

import { populateDemoAccount as populateDemoAccountLogic } from "@/business-logic";
import { resourceRef } from "@/utils";

export const populateDemoAccount: NonNullable<
  MutationResolvers["populateDemoAccount"]
> = async (_parent, { input }, ctx) => {
  const session = await requireSession(ctx);
  const userPk = resourceRef(
    "users",
    session.user?.id || "User ID is required"
  );

  const result = await populateDemoAccountLogic({
    industry: input.industry,
    unitType: input.unitType,
    teamSize: input.teamSize,
    companyName: input.companyName || undefined,
    unitName: input.unitName || undefined,
    teamName: input.teamName || undefined,
    actingUserPk: userPk,
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  return result as NonNullable<MutationResolvers["populateDemoAccount"]>;
};
