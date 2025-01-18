import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";
import { database } from "@/tables";

export const getEntitySettings = async <
  TKey extends SettingsTypeKey,
  TShape = SettingsShape<TKey>,
>(
  entityPk: string,
  settingsKey: TKey
): Promise<TShape | undefined> => {
  let settings: TShape | undefined;
  try {
    const { entity_settings } = await database();
    settings = (await entity_settings.get(entityPk, settingsKey))?.settings;
    if (settings == null) {
      return undefined;
    }
    return settingsTypes[settingsKey].parse(settings) as TShape;
  } catch (err) {
    console.error(err);
    throw new Error(
      `Error getting entity settings for entity: ${entityPk} and settings key: ${settingsKey}: ${JSON.stringify(
        settings
      )}: ${err.message}`
    );
  }
};
