import { createCompany } from "../../company/createCompany";
import { type GeneratedDemoData } from "../generateDemoData";
import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

export interface CreateDemoCompanyResult {
  success: boolean;
  company?: { pk: string; name: string; createdBy: string; createdAt: string };
  message?: string;
}

export const createDemoCompany = async (
  options: PopulateDemoAccountOptions,
  generatedData: GeneratedDemoData
): Promise<CreateDemoCompanyResult> => {
  try {
    // Get industry template for work schedule
    const industryTemplate = getIndustryTemplate(options.industry);

    // Create the company using existing business logic
    const companyResult = await createCompany({
      name: options.companyName || generatedData.companyName,
      actingUserPk: options.actingUserPk,
      workSchedule: industryTemplate.workSchedule,
    });

    if (!companyResult.success || !companyResult.company) {
      return {
        success: false,
        message: companyResult.message || "Failed to create demo company",
      };
    }

    return {
      success: true,
      company: companyResult.company,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
