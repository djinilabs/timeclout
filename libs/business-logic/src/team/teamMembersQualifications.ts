import { teamMembers } from "./teamMembers";
import { userTeamQualifications } from "./userTeamQualifications";

import { ResourceRef } from "@/utils";

type TeamMemberQualifications = {
  userPk: ResourceRef;
  qualifications: string[];
};

export const teamMembersQualifications = async (
  teamId: ResourceRef<"teams">
) => {
  const memberPks = await teamMembers(teamId);
  return (
    await Promise.all(
      memberPks.map(async (userPk) => ({
        userPk,
        qualifications: await userTeamQualifications(teamId, userPk),
      }))
    )
  ).filter(
    ({ qualifications }) => qualifications !== undefined
  ) as TeamMemberQualifications[];
};
