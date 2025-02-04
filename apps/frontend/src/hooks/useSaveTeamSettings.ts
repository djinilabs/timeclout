import { useMutation } from "./useMutation";
import updateTeamSettingsMutation from "@/graphql-client/mutations/updateTeamSettings.graphql";
import type { SettingsShape, SettingsTypeKey } from "@/settings";

export interface UseSaveTeamSettingsParams {
  teamPk: string;
  name: SettingsTypeKey;
}

export interface UseSaveTeamSettingsResponse<T extends SettingsTypeKey> {
  saveTeamSettings: (settings: SettingsShape<T>) => Promise<void>;
}

export const useSaveTeamSettings = <T extends SettingsTypeKey>({
  teamPk,
  name,
}: UseSaveTeamSettingsParams): UseSaveTeamSettingsResponse<T> => {
  const [, saveTeamSettingsMutation] = useMutation(updateTeamSettingsMutation);

  return {
    saveTeamSettings: async (settings: SettingsShape<T>) => {
      await saveTeamSettingsMutation({
        teamPk,
        name,
        settings,
      });
    },
  };
};
