import { createTeam } from "../../team/createTeam";
import { type GeneratedDemoData } from "../generateDemoData";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

// Simplified interface to avoid GraphQL import issues
export interface CreateDemoTeamResult {
  success: boolean;
  team?: {
    pk: string;
    name: string;
    unitPk: string;
    createdBy: string;
    createdAt: string;
  };
  message?: string;
}

export const createDemoTeam = async (
  options: PopulateDemoAccountOptions,
  generatedData: GeneratedDemoData,
  unitPk: string
): Promise<CreateDemoTeamResult> => {
  try {
    // Create the team using existing business logic
    const teamResult = await createTeam({
      name: options.teamName || generatedData.teamName,
      unitPk,
      actingUserPk: options.actingUserPk,
    });

    if (!teamResult.success || !teamResult.team) {
      return {
        success: false,
        message: teamResult.message || "Failed to create demo team",
      };
    }

    return {
      success: true,
      team: teamResult.team,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
