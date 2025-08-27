import { createUnit } from "../../unit/createUnit";
import { type GeneratedDemoData } from "../generateDemoData";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

// Simplified interface to avoid GraphQL import issues
export interface CreateDemoUnitResult {
  success: boolean;
  unit?: {
    pk: string;
    name: string;
    companyPk: string;
    createdBy: string;
    createdAt: string;
  };
  message?: string;
}

export const createDemoUnit = async (
  options: PopulateDemoAccountOptions,
  generatedData: GeneratedDemoData,
  companyPk: string
): Promise<CreateDemoUnitResult> => {
  try {
    // Create the unit using existing business logic
    const unitResult = await createUnit({
      name: options.unitName || generatedData.unitName,
      companyPk,
      actingUserPk: options.actingUserPk,
    });

    if (!unitResult.success || !unitResult.unit) {
      return {
        success: false,
        message: unitResult.message || "Failed to create demo unit",
      };
    }

    return {
      success: true,
      unit: unitResult.unit,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
