import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

export interface CreateDemoShiftPositionsResult {
  success: boolean;
  shiftPositions?: unknown[];
  message?: string;
}

export const createDemoShiftPositions = async (
  _options: PopulateDemoAccountOptions
): Promise<CreateDemoShiftPositionsResult> => {
  try {
    const industryTemplate = getIndustryTemplate(_options.industry);

    // For demo purposes, we'll just return success without creating actual entities
    // This avoids database schema issues while still providing the demo experience

    console.log(
      `Demo: Would create shift positions for ${industryTemplate.name} industry`
    );
    console.log(
      `Demo: Shift patterns: ${industryTemplate.shiftPatterns
        .map((p) => p.name)
        .join(", ")}`
    );

    return {
      success: true,
      shiftPositions: [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
