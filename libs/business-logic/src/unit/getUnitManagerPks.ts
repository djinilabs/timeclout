import { managersParser } from "@/settings";
import { database } from "@/tables";
import { unique } from "@/utils";

export const getUnitManagersPks = async (unitPks: string[]) => {
  const { entity_settings } = await database();
  return unique(
    (
      await Promise.all(
        unitPks.map(async (unitPk) =>
          managersParser.parse(
            (await entity_settings.get(unitPk, "managers"))?.settings
          )
        )
      )
    ).flat()
  );
};
