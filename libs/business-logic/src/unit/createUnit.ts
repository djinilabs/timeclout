import { nanoid } from "nanoid";

import { giveAuthorization } from "../auth/giveAuthorization";

import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

// Simplified interface to avoid GraphQL import issues
interface Unit {
  pk: string;
  name: string;
  companyPk: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateUnitOptions {
  name: string;
  companyPk: string;
  actingUserPk: string;
}

export interface CreateUnitResult {
  success: boolean;
  unit?: Unit;
  message?: string;
}

export const createUnit = async (
  options: CreateUnitOptions
): Promise<CreateUnitResult> => {
  try {
    const unitPk = resourceRef("units", nanoid());

    const unit = {
      pk: unitPk,
      companyPk: options.companyPk,
      createdBy: options.actingUserPk,
      createdAt: new Date().toISOString(),
      name: options.name,
    };

    const { entity, entity_settings } = await database();
    await entity.create(unit);

    // Give the acting user manager permissions for this unit
    await giveAuthorization(
      unitPk,
      options.actingUserPk,
      PERMISSION_LEVELS.WRITE,
      options.actingUserPk
    );

    // Create default unit settings
    const settings = {
      yearlyQuota: {
        resetMonth: 1,
        defaultQuota: 20,
      },
      workSchedule: {
        monday: { isWorkDay: true, start: "09:00", end: "17:00" },
        tuesday: { isWorkDay: true, start: "09:00", end: "17:00" },
        wednesday: { isWorkDay: true, start: "09:00", end: "17:00" },
        thursday: { isWorkDay: true, start: "09:00", end: "17:00" },
        friday: { isWorkDay: true, start: "09:00", end: "17:00" },
        saturday: { isWorkDay: false },
        sunday: { isWorkDay: false },
      },
    };

    // Create settings in database
    for (const [key, value] of Object.entries(settings)) {
      await entity_settings.create({
        pk: unitPk,
        sk: key,
        createdBy: options.actingUserPk,
        settings: value,
      });
    }

    return {
      success: true,
      unit: unit as Unit,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
