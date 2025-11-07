import { giveAuthorization } from "../auth/giveAuthorization";

import { database, PERMISSION_LEVELS } from "@/tables";

// Simplified interface to avoid GraphQL import issues
interface User {
  pk: string;
  name: string;
  email: string;
}

export interface CreateTeamMemberOptions {
  teamPk: string;
  userPk: string;
  actingUserPk: string;
  qualifications?: string[];
}

export interface CreateTeamMemberResult {
  success: boolean;
  user?: User;
  message?: string;
}

export const createTeamMember = async (
  options: CreateTeamMemberOptions
): Promise<CreateTeamMemberResult> => {
  try {
    const { entity_settings } = await database();

    // Give the user member permissions for this team
    await giveAuthorization(
      options.teamPk,
      options.userPk,
      PERMISSION_LEVELS.READ,
      options.actingUserPk
    );

    // If qualifications are provided, store them
    if (options.qualifications && options.qualifications.length > 0) {
      await entity_settings.create({
        pk: options.teamPk,
        sk: `user_${options.userPk}_qualifications`,
        createdBy: options.actingUserPk,
        settings: {
          qualifications: options.qualifications,
        },
      });
    }

    // For demo mode, we'll return a mock user since we don't have the actual user creation logic
    // In a real implementation, this would fetch the user from the database
    const mockUser: User = {
      pk: options.userPk,
      name: "Demo User", // This would come from the actual user record
      email: "demo@example.com", // This would come from the actual user record
    };

    return {
      success: true,
      user: mockUser,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
