import { type Company } from "@/graphql";
import { createCompany } from "../../company/createCompany";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";
import { type GeneratedDemoData } from "../generateDemoData";

export interface CreateDemoCompanyResult {
  success: boolean;
  company?: Company;
  message?: string;
}

export const createDemoCompany = async (
  options: PopulateDemoAccountOptions,
  generatedData: GeneratedDemoData
): Promise<CreateDemoCompanyResult> => {
  try {
    // Create the company using existing business logic
    const companyResult = await createCompany({
      name: options.companyName || generatedData.companyName,
      actingUserPk: options.actingUserPk,
    });

    if (!companyResult.success || !companyResult.company) {
      return {
        success: false,
        message: companyResult.message || "Failed to create demo company",
      };
    }

    // TODO: Set company-specific settings based on industry
    // This will include work schedules, leave types, etc.
    // For now, we'll use the default settings

    return {
      success: true,
      company: companyResult.company,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
