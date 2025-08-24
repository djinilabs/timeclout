import { i18n } from "@/locales";
import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";
import { database } from "@/tables";
import { ResourceRef } from "@/utils";

export const getEntitySettings = async <
  TKey extends SettingsTypeKey,
  TShape = SettingsShape<TKey>
>(
  entityPk: ResourceRef,
  settingsKey: TKey
): Promise<TShape | undefined> => {
  let settings: TShape | undefined;
  try {
    const { entity_settings } = await database();
    const entitySettingsResult = await entity_settings.get(
      entityPk,
      settingsKey
    );
    settings = entitySettingsResult?.settings;
    if (settings == undefined) {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      i18n._(
        "Error getting entity settings for entity: {entityPk} and settings key: {settingsKey}: {settings}: {errorMessage}",
        {
          entityPk: String(entityPk),
          settingsKey: String(settingsKey),
          settings: JSON.stringify(settings),
          errorMessage: error.message,
        }
      )
    );
  }
  if (settings == undefined) {
    return undefined;
  }
  try {
    return settingsTypes[settingsKey].parse(settings) as TShape;
  } catch (error) {
    console.error(error);
    throw new Error(
      i18n._(
        "Error parsing entity settings for entity: {entityPk} and settings key: {settingsKey}: {settings}: {errorMessage}",
        {
          entityPk: String(entityPk),
          settingsKey: String(settingsKey),
          settings: JSON.stringify(settings),
          errorMessage: error.message,
        }
      )
    );
  }
};
