import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";
import { database } from "@/tables";

export const getEntitySettings = async <
  TKey extends SettingsTypeKey,
  TShape = SettingsShape<TKey>,
>(
  entityPk: string,
  settingsKey: TKey
): Promise<TShape | undefined> => {
  const { entity_settings } = await database();
  const settings = await entity_settings.get(entityPk, "settings");
  if (settings == null) {
    return undefined;
  }
  return settingsTypes[settingsKey].parse(settings) as TShape;
};
