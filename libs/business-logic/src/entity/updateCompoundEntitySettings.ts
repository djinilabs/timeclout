import { database } from "@/tables";
import { settingsTypes } from "@/settings";

export const updateCompoundEntitySettings = async (
  entityRef: string,
  name: string,
  unparsedSettings: Record<string, unknown>,
  actingUserPk: string
) => {
  const { entity_settings } = await database();
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
};
