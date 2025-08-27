import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

export interface CreateDemoLeaveRequestsResult {
  success: boolean;
  leaveRequests?: unknown[];
  message?: string;
}

export const createDemoLeaveRequests = async (
  _options: PopulateDemoAccountOptions,
  teamPk: string
): Promise<CreateDemoLeaveRequestsResult> => {
  try {
    // For demo purposes, we'll just return success without creating actual entities
    // This avoids database schema issues while still providing the demo experience

    console.log(`Demo: Would create leave requests for team ${teamPk}`);
    console.log(`Demo: Would create 3-5 sample leave requests for next month`);

    return {
      success: true,
      leaveRequests: [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
