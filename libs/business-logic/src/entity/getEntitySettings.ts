import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";
import { database } from "@/tables";
import { ResourceRef } from "@/utils";
import { i18n } from "@/locales";

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
    settings = (await entity_settings.get(entityPk, settingsKey))?.settings;
    if (settings == null) {
      return undefined;
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      i18n._(
        "Error getting entity settings for entity: {entityPk} and settings key: {settingsKey}: {settings}: {errorMessage}",
        {
          entityPk: String(entityPk),
          settingsKey: String(settingsKey),
          settings: JSON.stringify(settings),
          errorMessage: err.message,
        }
      )
    );
  }
  if (settings == null) {
    return undefined;
  }
  try {
    return settingsTypes[settingsKey].parse(settings) as TShape;
  } catch (err) {
    console.error(err);
    throw new Error(
      i18n._(
        "Error parsing entity settings for entity: {entityPk} and settings key: {settingsKey}: {settings}: {errorMessage}",
        {
          entityPk: String(entityPk),
          settingsKey: String(settingsKey),
          settings: JSON.stringify(settings),
          errorMessage: err.message,
        }
      )
    );
  }
};
