import { FC, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDefined } from "@/utils";
import { Qualifications, qualificationsParser } from "@/settings";
import teamWithSettingsQuery from "@/graphql-client/queries/teamWithSettings.graphql";
import updateTeamMemberQualificationsMutation from "@/graphql-client/mutations/updateTeamMemberQualifications.graphql";
import { QueryTeamArgs, Team, TeamSettingsArgs } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { Suspense } from "./Suspense";
import { useMutation } from "../hooks/useMutation";
import { EditQualifications } from "./EditQualifications";

export interface TeamMemberQualificationsProps {
  qualifications: string[];
  memberPk: string;
}

const InternalTeamMemberQualifications: FC<TeamMemberQualificationsProps> = ({
  qualifications,
  memberPk,
}) => {
  const { team: teamPk } = useParams();
  const [teamWithMembersAndSettingsQueryResponse] = useQuery<
    { team: Team },
    QueryTeamArgs & TeamSettingsArgs
  >({
    query: teamWithSettingsQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
      name: "qualifications",
    },
  });
  const team = teamWithMembersAndSettingsQueryResponse?.data?.team;
  const teamQualifications: Qualifications =
    team?.settings && qualificationsParser.parse(team.settings);

  const [, updateTeamMemberQualifications] = useMutation(
    updateTeamMemberQualificationsMutation
  );

  const onChange = useCallback(
    async (qualifications: string[]) => {
      const response = await updateTeamMemberQualifications({
        teamPk: getDefined(teamPk, "No team provided"),
        memberPk: getDefined(memberPk, "No member provided"),
        qualifications,
      });

      if (!response.error) {
        toast.success("Qualification added");
      }
    },
    [memberPk, teamPk, updateTeamMemberQualifications]
  );

  return (
    <EditQualifications
      qualifications={qualifications}
      onChange={onChange}
      qualificationSettings={teamQualifications}
    />
  );
};

export const TeamMemberQualifications: FC<TeamMemberQualificationsProps> = (
  props
) => {
  return (
    <Suspense>
      <InternalTeamMemberQualifications {...props} />
    </Suspense>
  );
};
