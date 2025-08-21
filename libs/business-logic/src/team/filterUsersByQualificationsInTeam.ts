import { userTeamQualifications } from "./userTeamQualifications";

import { EntityRecord } from "@/tables";
import { getResourceRef, ResourceRef } from "@/utils";

export const filterUsersByQualificationsInTeam = async (
  users: EntityRecord[],
  requiredQualifications: string[],
  teamPk: ResourceRef<"teams">
) => {
  const keepUser = await Promise.all(
    users.map(async (user) => {
      const userQualifications = await userTeamQualifications(
        teamPk,
        getResourceRef(user.pk)
      );
      return requiredQualifications.some((requiredQualification) =>
        userQualifications?.includes(requiredQualification)
      );
    })
  );

  return users.filter((_user, index) => keepUser[index]);
};
