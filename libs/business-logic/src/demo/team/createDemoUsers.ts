import { nanoid } from "nanoid";

import { createTeamMember } from "../../team/createTeamMember";
import { type GeneratedDemoData } from "../generateDemoData";
import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

import { database } from "@/tables";
import { compoundedResourceRef, resourceRef } from "@/utils";

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
  generatedData: GeneratedDemoData,
  teamPk: string
): Promise<CreateDemoUsersResult> => {
  try {
    const industryTemplate = getIndustryTemplate(options.industry);

    console.log(
      `Demo: Creating ${generatedData.users.length} team members for ${industryTemplate.name} industry`
    );
    console.log(
      `Demo: Team members: ${generatedData.users.map((u) => u.name).join(", ")}`
    );

    const createdUsers: User[] = [];

    // Create each team member with their qualifications
    for (const userData of generatedData.users) {
      try {
        // Create a unique user PK
        const userPk = resourceRef("users", nanoid());

        // Create the team member with qualifications
        const result = await createTeamMember({
          teamPk,
          userPk,
          actingUserPk: options.actingUserPk,
          qualifications: userData.qualifications,
        });

        if (result.success && result.user) {
          // Update the user with the actual demo data
          const { entity } = await database();
          await entity.upsert({
            pk: userPk,
            name: userData.name,
            email: userData.email,
            createdBy: options.actingUserPk,
            createdAt: new Date().toISOString(),
          });

          // Store user qualifications using the proper team member qualification system
          const { entity_settings } = await database();
          const userTeamRef = compoundedResourceRef(
            teamPk as `teams/${string}`,
            userPk as `users/${string}`
          );

          await entity_settings.create({
            pk: userTeamRef,
            sk: "userQualifications",
            createdBy: options.actingUserPk,
            settings: userData.qualifications,
          });

          createdUsers.push({
            pk: userPk,
            name: userData.name,
            email: userData.email,
          });

          console.log(
            `✅ Created team member: ${
              userData.name
            } with qualifications: ${userData.qualifications.join(", ")}`
          );
        } else {
          console.warn(
            `⚠️ Failed to create team member: ${userData.name}`,
            result.message
          );
        }
      } catch (error) {
        console.warn(`⚠️ Error creating team member: ${userData.name}`, error);
        // Continue with other users even if one fails
      }
    }

    if (createdUsers.length === 0) {
      return {
        success: false,
        message: "Failed to create any team members",
      };
    }

    console.log(`✅ Successfully created ${createdUsers.length} team members`);

    return {
      success: true,
      users: createdUsers,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
