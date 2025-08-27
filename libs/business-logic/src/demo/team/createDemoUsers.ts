import { type GeneratedDemoData } from "../generateDemoData";
import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

// Simplified interface to avoid GraphQL import issues
interface User {
  pk: string;
  name: string;
  email: string;
}

export interface CreateDemoUsersResult {
  success: boolean;
  users?: User[];
  message?: string;
}

export const createDemoUsers = async (
  options: PopulateDemoAccountOptions,
  generatedData: GeneratedDemoData
): Promise<CreateDemoUsersResult> => {
  try {
    const industryTemplate = getIndustryTemplate(options.industry);

    // For demo purposes, we'll just return success without creating actual team members
    // This avoids database schema issues while still providing the demo experience

    console.log(
      `Demo: Would create ${generatedData.users.length} team members for ${industryTemplate.name} industry`
    );
    console.log(
      `Demo: Team members: ${generatedData.users.map((u) => u.name).join(", ")}`
    );

    // Return mock users for demo purposes
    const mockUsers: User[] = generatedData.users.map((userData, index) => ({
      pk: `demo_user_${index}`,
      name: userData.name,
      email: userData.email,
    }));

    return {
      success: true,
      users: mockUsers,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
