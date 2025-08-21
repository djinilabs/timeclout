import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { updateEntitySettings } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const updateTeamSettings: NonNullable<MutationResolvers['updateTeamSettings']> = async (_parent, arg, ctx) => {
  const teamRef = resourceRef("teams", arg.teamPk);
  const userPk = await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);
  return updateEntitySettings(
    teamRef,
    arg.name,
    arg.settings,
    userPk
  ) as unknown as Promise<Team>;
};
