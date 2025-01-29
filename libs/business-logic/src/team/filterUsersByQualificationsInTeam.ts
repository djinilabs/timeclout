import { getResourceRef, ResourceRef } from "@/utils";
import { EntityRecord } from "@/tables";
import { userTeamQualifications } from "./userTeamQualifications";

export const filterUsersByQualificationsInTeam = async (
  users: EntityRecord[],
  skills: string[],
  teamPk: ResourceRef<"teams">
) => {
  const keepUser = await Promise.all(
    users.map(async (user) => {
      const qualifications = await userTeamQualifications(
        teamPk,
        getResourceRef(user.pk)
      );
      return skills.every((skill) => qualifications?.includes(skill));
    })
  );

  return users.filter((_user, index) => keepUser[index]);
};
