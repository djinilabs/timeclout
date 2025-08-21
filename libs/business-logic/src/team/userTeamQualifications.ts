import { getEntitySettings } from "../entity";

import { compoundedResourceRef , ResourceRef } from "@/utils";


export const userTeamQualifications = async (
  teamId: ResourceRef<"teams">,
  userPk: ResourceRef<"users">
) => {
  return getEntitySettings(
    compoundedResourceRef(teamId, userPk),
    "userQualifications"
  );
};
