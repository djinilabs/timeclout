import { settingsTypes } from "@/settings";
import { database } from "@/tables";

export const updateCompoundEntitySettings = async (
  entityReference: string,
  name: string,
  unparsedSettings: unknown,
  actingUserPk: string
) => {
  const { entity_settings } = await database();
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
};
