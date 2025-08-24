import { useMemo } from "react";

import { QueryTeamArgs as QueryTeamArguments, Team, TeamSettingsArgs as TeamSettingsArguments } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

import teamWithSettingsQuery from "@/graphql-client/queries/teamWithSettings.graphql";
import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";


export interface UseTeamWithSettingsParameters<T extends SettingsTypeKey> {
  teamPk: string;
  settingsName: T;
}

export interface useTeamWithSettingsResponse<T extends SettingsTypeKey> {
  team: Team | undefined;
  settings: SettingsShape<T> | undefined;
}

export const useTeamWithSettings = <T extends SettingsTypeKey>({
  teamPk,
  settingsName,
}: UseTeamWithSettingsParameters<T>): useTeamWithSettingsResponse<T> => {
  const [teamWithSettingsQueryResponse] = useQuery<
    { team: Team },
    QueryTeamArguments & TeamSettingsArguments
  >({
    query: teamWithSettingsQuery,
    variables: {
      teamPk,
      name: settingsName,
    },
  });
  const team = teamWithSettingsQueryResponse?.data?.team;
  const teamSettings: SettingsShape<T> = useMemo(
    () => team?.settings && settingsTypes[settingsName].parse(team.settings),
    [team?.settings, settingsName]
  );

  return {
    team,
    settings: teamSettings,
  };
};
