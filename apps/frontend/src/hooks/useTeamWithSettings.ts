import { useMemo } from "react";

import { QueryTeamArgs, Team, TeamSettingsArgs } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

import teamWithSettingsQuery from "@/graphql-client/queries/teamWithSettings.graphql";
import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";

export interface UseTeamWithSettingsParams<T extends SettingsTypeKey> {
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
}: UseTeamWithSettingsParams<T>): useTeamWithSettingsResponse<T> => {
  const [teamWithSettingsQueryResponse] = useQuery<
    { team: Team },
    QueryTeamArgs & TeamSettingsArgs
  >({
    query: teamWithSettingsQuery,
    variables: {
      teamPk,
      name: settingsName,
    },
  });
  const team = teamWithSettingsQueryResponse?.data?.team;
  const unparsedSettings = team?.settings;
  const teamSettings: SettingsShape<T> = useMemo(
    () =>
      unparsedSettings && settingsTypes[settingsName].parse(unparsedSettings),
    [unparsedSettings, settingsName]
  );

  return {
    team,
    settings: teamSettings,
  };
};
