import { getIndustryTemplate } from "./industryTemplates";
import { generateDemoData, type DemoDataOptions } from "./generateDemoData";

export interface PopulateDemoAccountOptions {
  industry: string;
  unitType: string;
  teamSize: number;
  companyName?: string;
  unitName?: string;
  teamName?: string;
  actingUserPk: string;
}

export interface PopulateDemoAccountResult {
  success: boolean;
  company: any;
  unit: any;
  team: any;
  users: any[];
  message: string;
}

export const populateDemoAccount = async (
  options: PopulateDemoAccountOptions
): Promise<PopulateDemoAccountResult> => {
  try {
    const { industry, unitType, teamSize, actingUserPk } = options;

    // Validate team size
    if (teamSize < 1 || teamSize > 20) {
      throw new Error("Team size must be between 1 and 20");
    }

    // Get industry template
    const industryTemplate = getIndustryTemplate(industry);

    // Generate demo data
    const demoData = generateDemoData({
      industry,
      unitType,
      teamSize,
      companyName: options.companyName,
      unitName: options.unitName,
      teamName: options.teamName,
    });

    // TODO: Implement actual creation functions
    // For now, return mock data structure

    const result: PopulateDemoAccountResult = {
      success: true,
      company: {
        name: demoData.companyName,
        industry: industryTemplate.name,
        // Other company properties will be added when we implement the actual creation
      },
      unit: {
        name: demoData.unitName,
        // Other unit properties will be added when we implement the actual creation
      },
      team: {
        name: demoData.teamName,
        // Other team properties will be added when we implement the actual creation
      },
      users: demoData.users.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
        qualifications: user.qualifications,
        // Other user properties will be added when we implement the actual creation
      })),
      message: `Successfully populated demo account for ${industryTemplate.name} industry with ${teamSize} team members`,
    };

    return result;
  } catch (error) {
    return {
      success: false,
      company: null,
      unit: null,
      team: null,
      users: [],
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
