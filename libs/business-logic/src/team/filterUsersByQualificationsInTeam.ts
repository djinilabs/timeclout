import { getResourceRef, ResourceRef } from "@/utils";
import { EntityRecord } from "@/tables";
import { userTeamQualifications } from "./userTeamQualifications";

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
