import { nanoid } from "nanoid";

import { giveAuthorization } from "../auth/giveAuthorization";

import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

// Simplified interface to avoid GraphQL import issues
interface Team {
  pk: string;
  name: string;
  parentPk: string; // Database schema uses parentPk
  createdBy: string;
  createdAt: string;
}

export interface CreateTeamOptions {
  name: string;
  unitPk: string;
  actingUserPk: string;
}

export interface CreateTeamResult {
  success: boolean;
  team?: Team;
  message?: string;
}

export const createTeam = async (
  options: CreateTeamOptions
): Promise<CreateTeamResult> => {
  try {
    const teamPk = resourceRef("teams", nanoid());

    const team = {
      pk: teamPk,
      parentPk: options.unitPk, // Database schema uses parentPk
      createdBy: options.actingUserPk,
      createdAt: new Date().toISOString(),
      name: options.name,
    };

    const { entity, entity_settings } = await database();
    await entity.create(team);

    // Give the acting user manager permissions for this team
    await giveAuthorization(
      teamPk,
      options.actingUserPk,
      PERMISSION_LEVELS.WRITE,
      options.actingUserPk
    );

    // Create default team settings
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
        pk: teamPk,
        sk: key,
        createdBy: options.actingUserPk,
        settings: value,
      });
    }

    return {
      success: true,
      team: team as Team,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
