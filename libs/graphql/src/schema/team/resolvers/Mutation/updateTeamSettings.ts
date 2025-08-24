import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { updateEntitySettings } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const updateTeamSettings: NonNullable<MutationResolvers['updateTeamSettings']> = async (_parent, argument, context) => {
  const teamReference = resourceRef("teams", argument.teamPk);
  const userPk = await ensureAuthorized(context, teamReference, PERMISSION_LEVELS.WRITE);
  return updateEntitySettings(
    teamReference,
    argument.name,
    argument.settings,
    userPk
  ) as unknown as Promise<Team>;
};
