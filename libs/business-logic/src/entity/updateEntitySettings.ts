import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { settingsTypes } from "@/settings";
import { i18n } from "@/locales";

export const updateEntitySettings = async (
  entityRef: string,
  name: string,
  unparsedSettings: Record<string, unknown>,
  actingUserPk: string
) => {
  const { entity, entity_settings } = await database();
  const entityRecord = await entity.get(entityRef);
  if (!entityRecord) {
    throw notFound(
      i18n._("Entity with pk {entityRef} not found", { entityRef })
    );
  }
  const settings =
    settingsTypes[name as keyof typeof settingsTypes].parse(unparsedSettings);
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
