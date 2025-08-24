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
  const results = await Promise.all(
    memberPks.map(async (userPk) => ({
      userPk,
      qualifications: await userTeamQualifications(teamId, userPk),
    }))
  );
  return results.filter(
    ({ qualifications }) => qualifications !== undefined
  ) as TeamMemberQualifications[];
};
