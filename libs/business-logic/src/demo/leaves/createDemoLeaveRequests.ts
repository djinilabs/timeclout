import { createLeaveRequest } from "../../leaveRequest/createLeaveRequest";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

import { leaveTypeParser } from "@/settings";
import { database } from "@/tables";

export interface CreateDemoLeaveRequestsResult {
  success: boolean;
  leaveRequests?: unknown[];
  message?: string;
}

export const createDemoLeaveRequests = async (
  options: PopulateDemoAccountOptions,
  teamPk: string
): Promise<CreateDemoLeaveRequestsResult> => {
  try {
    console.log(`Demo: Creating leave requests for team ${teamPk}`);

    // Get the company PK from the team's parent hierarchy
    const { entity, permission } = await database();

    // Get team to find unit
    const team = await entity.get(teamPk);
    if (!team || !team.parentPk) {
      console.warn(
        "Demo: Team or team parent not found, skipping leave requests"
      );
      return { success: true, leaveRequests: [] };
    }

    // Get unit to find company
    const unit = await entity.get(team.parentPk);
    if (!unit || !unit.parentPk) {
      console.warn(
        "Demo: Unit or unit parent not found, skipping leave requests"
      );
      return { success: true, leaveRequests: [] };
    }

    const companyPk = unit.parentPk;

    // Get company leave types
    const { entity_settings } = await database();
    const leaveTypesSetting = await entity_settings.get(
      companyPk,
      "leaveTypes"
    );
    if (!leaveTypesSetting) {
      console.warn("Demo: Leave types not found, skipping leave requests");
      return { success: true, leaveRequests: [] };
    }

    const leaveTypes = leaveTypeParser.parse(leaveTypesSetting.settings);
    console.log(
      `Demo: Found leave types: ${leaveTypes.map((lt) => lt.name).join(", ")}`
    );

    // Get team members
    const { items: permissions } = await permission.query({
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": teamPk,
      },
    });

    const teamMemberPks = permissions
      .filter((p) => p.sk.startsWith("users/"))
      .map((p) => p.sk);

    if (teamMemberPks.length === 0) {
      console.warn("Demo: No team members found, skipping leave requests");
      return { success: true, leaveRequests: [] };
    }

    console.log(`Demo: Found ${teamMemberPks.length} team members`);

    // Generate dates for the next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const startOfMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      0
    );

    const createdLeaveRequests = [];

    // Create 3-5 leave requests for different team members
    const numLeaveRequests = Math.floor(Math.random() * 3) + 3; // 3-5 requests

    for (let i = 0; i < numLeaveRequests; i++) {
      try {
        // Pick a random team member
        const memberPk =
          teamMemberPks[Math.floor(Math.random() * teamMemberPks.length)];

        // Prefer leave types that don't require approval for demo purposes
        const noApprovalTypes = leaveTypes.filter(
          (lt) => !lt.needsManagerApproval
        );
        const preferredLeaveType =
          noApprovalTypes.length > 0
            ? noApprovalTypes[
                Math.floor(Math.random() * noApprovalTypes.length)
              ]
            : leaveTypes[Math.floor(Math.random() * leaveTypes.length)];

        // Generate random dates within the next month
        const startDate = new Date(startOfMonth);
        startDate.setDate(
          startOfMonth.getDate() +
            Math.floor(Math.random() * (endOfMonth.getDate() - 1))
        );

        const duration = Math.floor(Math.random() * 5) + 1; // 1-5 days
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration - 1);

        // Ensure end date doesn't exceed month end
        if (endDate > endOfMonth) {
          endDate.setTime(endOfMonth.getTime());
        }

        // Generate realistic reasons based on leave type
        const reasons = {
          Vacation: [
            "Family vacation",
            "Beach holiday",
            "Mountain retreat",
            "City break",
            "Relaxation time",
          ],
          "Sick Leave": [
            "Not feeling well",
            "Medical appointment",
            "Recovery time",
            "Health check-up",
          ],
          "Personal Leave": [
            "Personal matters",
            "Family event",
            "Appointment",
            "Personal time",
          ],
          Training: [
            "Professional development course",
            "Skills workshop",
            "Certification training",
            "Industry conference",
            "Team building session",
          ],
        };

        const reasonOptions = reasons[
          preferredLeaveType.name as keyof typeof reasons
        ] || ["Personal time"];
        const reason =
          reasonOptions[Math.floor(Math.random() * reasonOptions.length)];

        // Create the leave request
        const leaveRequest = await createLeaveRequest({
          companyPk: companyPk as `companies/${string}`,
          userPk: memberPk as `users/${string}`,
          actingUserPk: options.actingUserPk as `users/${string}`,
          leaveTypeName: preferredLeaveType.name,
          startDateAsString: startDate.toISOString().split("T")[0],
          endDateAsString: endDate.toISOString().split("T")[0],
          reason,
        });

        createdLeaveRequests.push(leaveRequest);

        console.log(
          `✅ Created leave request: ${preferredLeaveType.name} for ${
            startDate.toISOString().split("T")[0]
          } to ${endDate.toISOString().split("T")[0]} - ${reason}`
        );
      } catch (error) {
        console.warn(`⚠️ Failed to create leave request ${i + 1}:`, error);
        // Continue with other requests
      }
    }

    console.log(
      `✅ Successfully created ${createdLeaveRequests.length} leave requests for next month`
    );

    return {
      success: true,
      leaveRequests: createdLeaveRequests,
    };
  } catch (error) {
    console.warn("Demo: Error creating leave requests:", error);
    return {
      success: true, // Don't fail the demo for leave request issues
      leaveRequests: [],
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
