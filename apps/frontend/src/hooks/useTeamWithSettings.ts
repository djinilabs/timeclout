import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";
import teamWithSettingsQuery from "@/graphql-client/queries/teamWithSettings.graphql";
import { QueryTeamArgs, Team, TeamSettingsArgs } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

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
  const teamSettings: SettingsShape<T> =
    team?.settings && settingsTypes[settingsName].parse(team.settings);

  return {
    team,
    settings: teamSettings,
  };
};
