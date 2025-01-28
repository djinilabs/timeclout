import { ResourceRef } from "@/utils";
import { EntityRecord } from "@/tables";

export const filterUsersBySkillsInTeam = async (
  users: EntityRecord[],
  skills: string[],
  teamPk: ResourceRef
) => {
  return users;
};
