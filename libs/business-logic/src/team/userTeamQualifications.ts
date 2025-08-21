import { compoundedResourceRef , ResourceRef } from "@/utils";

import { getEntitySettings } from "../entity";

export const userTeamQualifications = async (
  teamId: ResourceRef<"teams">,
  userPk: ResourceRef<"users">
) => {
  return getEntitySettings(
    compoundedResourceRef(teamId, userPk),
    "userQualifications"
  );
};
