import { createDemoCompany } from "./company/createDemoCompany";
import { generateDemoData } from "./generateDemoData";
import { createDemoLeaveRequests } from "./leaves/createDemoLeaveRequests";
import { createDemoShiftPositions } from "./shifts/createDemoShiftPositions";
import { createDemoTeam } from "./team/createDemoTeam";
import { createDemoUsers } from "./team/createDemoUsers";
import { createDemoUnit } from "./unit/createDemoUnit";

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
  company?: { pk: string };
  unit?: { pk: string };
  team?: { pk: string };
  users?: unknown[];
  message?: string;
}

export const populateDemoAccount = async (
  options: PopulateDemoAccountOptions
): Promise<PopulateDemoAccountResult> => {
  try {
    const { industry, unitType, teamSize } = options;

    // Generate demo data based on industry
    const generatedData = generateDemoData({
      industry,
      unitType,
      teamSize,
    });

    // Step 1: Create company
    const companyResult = await createDemoCompany(options, generatedData);
    if (!companyResult.success || !companyResult.company) {
      return {
        success: false,
        message: companyResult.message || "Failed to create demo company",
      };
    }

    // Step 2: Create unit
    const unitResult = await createDemoUnit(
      options,
      generatedData,
      companyResult.company.pk
    );
    if (!unitResult.success || !unitResult.unit) {
      return {
        success: false,
        message: unitResult.message || "Failed to create demo unit",
      };
    }

    // Step 3: Create team
    const teamResult = await createDemoTeam(
      options,
      generatedData,
      unitResult.unit.pk
    );
    if (!teamResult.success || !teamResult.team) {
      return {
        success: false,
        message: teamResult.message || "Failed to create demo team",
      };
    }

    // Step 4: Create team members
    const usersResult = await createDemoUsers(options, generatedData);
    if (!usersResult.success || !usersResult.users) {
      return {
        success: false,
        message: usersResult.message || "Failed to create demo users",
      };
    }

    // Step 5: Create shift positions
    const shiftPositionsResult = await createDemoShiftPositions(options);
    if (!shiftPositionsResult.success) {
      console.warn(
        "Failed to create demo shift positions:",
        shiftPositionsResult.message
      );
      // Continue anyway as this is not critical
    }

    // Step 6: Create leave requests
    const leaveRequestsResult = await createDemoLeaveRequests(
      options,
      teamResult.team.pk
    );
    if (!leaveRequestsResult.success) {
      console.warn(
        "Failed to create demo leave requests:",
        leaveRequestsResult.message
      );
      // Continue anyway as this is not critical
    }

    return {
      success: true,
      company: companyResult.company,
      unit: unitResult.unit,
      team: teamResult.team,
      users: usersResult.users,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
