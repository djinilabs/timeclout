import { useMutation } from "./useMutation";

import updateTeamSettingsMutation from "@/graphql-client/mutations/updateTeamSettings.graphql";
import type { SettingsShape, SettingsTypeKey } from "@/settings";

export interface UseSaveTeamSettingsParams<T extends SettingsTypeKey> {
  teamPk: string;
  name: T;
}

export interface UseSaveTeamSettingsResponse<T extends SettingsTypeKey> {
  saveTeamSettings: (settings: SettingsShape<T>) => Promise<void>;
}

export const useSaveTeamSettings = <T extends SettingsTypeKey>({
  teamPk,
  name,
}: UseSaveTeamSettingsParams<T>): UseSaveTeamSettingsResponse<T> => {
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
