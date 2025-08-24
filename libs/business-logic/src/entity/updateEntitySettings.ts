import { notFound } from "@hapi/boom";

import { i18n } from "@/locales";
import { settingsTypes } from "@/settings";
import { database } from "@/tables";

export const updateEntitySettings = async (
  entityReference: string,
  name: string,
  unparsedSettings: Record<string, unknown>,
  actingUserPk: string
) => {
  const { entity, entity_settings } = await database();
  const entityRecord = await entity.get(entityReference);
  if (!entityRecord) {
    throw notFound(
      i18n._("Entity with pk {entityRef} not found", { entityRef: entityReference })
    );
  }
  const settings =
    settingsTypes[name as keyof typeof settingsTypes].parse(unparsedSettings);
  await entity_settings.upsert({
    pk: entityReference,
    sk: name,
    settings,
    createdBy: actingUserPk,
    createdAt: new Date().toISOString(),
    updatedBy: actingUserPk,
    updatedAt: new Date().toISOString(),
  });
  return entityRecord;
};
