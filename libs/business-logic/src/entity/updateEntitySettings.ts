import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";

export const updateEntitySettings = async (
  entityRef: string,
  name: string,
  unparsedSettings: Record<string, any>,
  actingUserPk: string
) => {
  const { entity, entity_settings } = await database();
  const entityRecord = await entity.get(entityRef);
  if (!entityRecord) {
    throw notFound(`Entity with pk ${entityRef} not found`);
  }
  const settings = settingsTypes[name].parse(unparsedSettings);
  await entity_settings.upsert({
    pk: entityRef,
    sk: name,
    settings,
    createdBy: actingUserPk,
    createdAt: new Date().toISOString(),
    updatedBy: actingUserPk,
    updatedAt: new Date().toISOString(),
  });
  return entityRecord;
};
