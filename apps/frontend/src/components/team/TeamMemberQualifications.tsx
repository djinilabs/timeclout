import { i18n } from "@lingui/core";
import { FC, useCallback } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";


import { useMutation } from "../../hooks/useMutation";
import { useTeamWithSettings } from "../../hooks/useTeamWithSettings";
import { Suspense } from "../atoms/Suspense";

import { EditQualifications } from "./EditQualifications";

import updateTeamMemberQualificationsMutation from "@/graphql-client/mutations/updateTeamMemberQualifications.graphql";
import { getDefined } from "@/utils";

export interface TeamMemberQualificationsProps {
  qualifications: string[];
  memberPk: string;
}

const InternalTeamMemberQualifications: FC<TeamMemberQualificationsProps> = ({
  qualifications,
  memberPk,
}) => {
  const { team: teamPk } = useParams();
  const { settings: teamQualifications } = useTeamWithSettings({
    teamPk: getDefined(teamPk, "No team provided"),
    settingsName: "qualifications",
  });

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
        toast.success(i18n.t("Qualifications changed"));
      }
    },
    [memberPk, teamPk, updateTeamMemberQualifications]
  );

  return (
    <EditQualifications
      qualifications={qualifications}
      onChange={onChange}
      qualificationSettings={teamQualifications ?? []}
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
