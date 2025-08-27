import { createTeam } from "../../team/createTeam";
import { type GeneratedDemoData } from "../generateDemoData";
import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

import { database } from "@/tables";

// Simplified interface to avoid GraphQL import issues
export interface CreateDemoTeamResult {
  success: boolean;
  team?: {
    pk: string;
    name: string;
    parentPk: string;
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

    // Create team qualifications based on industry template
    const industryTemplate = getIndustryTemplate(options.industry);
    const { entity_settings } = await database();

    // Create team qualifications setting
    const colors = [
      "green",
      "blue",
      "purple",
      "orange",
      "red",
      "teal",
      "indigo",
      "pink",
    ];
    const teamQualifications = industryTemplate.qualificationSuggestions.map(
      (qualName, index) => ({
        name: qualName,
        color: colors[index % colors.length],
      })
    );

    await entity_settings.create({
      pk: teamResult.team.pk,
      sk: "qualifications",
      createdBy: options.actingUserPk,
      settings: teamQualifications,
    });

    console.log(
      `✅ Created team qualifications: ${teamQualifications
        .map((q) => q.name)
        .join(", ")}`
    );

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
