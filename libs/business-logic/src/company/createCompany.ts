import { nanoid } from "nanoid";

import { giveAuthorization } from "../auth/giveAuthorization";

import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

// Simplified interface to avoid GraphQL import issues
interface Company {
  pk: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateCompanyOptions {
  name: string;
  actingUserPk: string;
  workSchedule?: {
    monday: { isWorkDay: boolean; start?: string; end?: string };
    tuesday: { isWorkDay: boolean; start?: string; end?: string };
    wednesday: { isWorkDay: boolean; start?: string; end?: string };
    thursday: { isWorkDay: boolean; start?: string; end?: string };
    friday: { isWorkDay: boolean; start?: string; end?: string };
    saturday: { isWorkDay: boolean; start?: string; end?: string };
    sunday: { isWorkDay: boolean; start?: string; end?: string };
  };
}

export interface CreateCompanyResult {
  success: boolean;
  company?: Company;
  message?: string;
}

export const createCompany = async (
  options: CreateCompanyOptions
): Promise<CreateCompanyResult> => {
  try {
    const companyPk = resourceRef("companies", nanoid());

    const company = {
      pk: companyPk,
      createdBy: options.actingUserPk,
      createdAt: new Date().toISOString(),
      name: options.name,
    };

    const { entity, entity_settings } = await database();
    await entity.create(company);

    // Give the acting user owner permissions
    await giveAuthorization(
      companyPk,
      options.actingUserPk,
      PERMISSION_LEVELS.OWNER,
      options.actingUserPk
    );

    // Create default settings
    const defaultWorkSchedule = {
      monday: { isWorkDay: true, start: "09:00", end: "17:00" },
      tuesday: { isWorkDay: true, start: "09:00", end: "17:00" },
      wednesday: { isWorkDay: true, start: "09:00", end: "17:00" },
      thursday: { isWorkDay: true, start: "09:00", end: "17:00" },
      friday: { isWorkDay: true, start: "09:00", end: "17:00" },
      saturday: { isWorkDay: false },
      sunday: { isWorkDay: false },
    };

    const settings = {
      leaveTypes: [
        { name: "Vacation", color: "#10B981", defaultQuota: 20 },
        { name: "Sick Leave", color: "#EF4444", defaultQuota: 10 },
        { name: "Personal Leave", color: "#8B5CF6", defaultQuota: 5 },
      ],
      yearlyQuota: {
        resetMonth: 1,
        defaultQuota: 20,
      },
      workSchedule: options.workSchedule || defaultWorkSchedule,
    };

    // Create settings in database
    for (const [key, value] of Object.entries(settings)) {
      await entity_settings.create({
        pk: companyPk,
        sk: key,
        createdBy: options.actingUserPk,
        settings: value,
      });
    }

    return {
      success: true,
      company: company as Company,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
