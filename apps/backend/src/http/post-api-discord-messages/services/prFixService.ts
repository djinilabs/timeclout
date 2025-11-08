/**
 * Main PR Fix Service
 * Orchestrates the process of triggering Cursor agent to fix PR issues
 * Uses fire-and-forget pattern - returns immediately after triggering agent
 */

import { triggerCursorAgent } from "./cursorApiService";
import { parseRepository } from "./githubService";
import { analyzePR } from "./prAnalysisService";

export interface PRFixRequest {
  prNumber: number;
  branchName: string;
  repository: string;
  errorDetails?: string;
}

export interface PRFixResponse {
  success: boolean;
  agentId?: string;
  message: string;
}

/**
 * Main service to trigger Cursor agent for PR fixes
 * Returns immediately after triggering (fire-and-forget)
 */
export async function triggerPRFix(
  request: PRFixRequest
): Promise<PRFixResponse> {
  try {
    // Validate repository format
    const repoInfo = parseRepository(request.repository);
    if (!repoInfo) {
      return {
        success: false,
        message: `Invalid repository format: ${request.repository}`,
      };
    }

    // Analyze PR to validate conditions
    const analysis = await analyzePR(request.repository, request.prNumber);

    if (!analysis) {
      return {
        success: false,
        message: `Failed to analyze PR #${request.prNumber}`,
      };
    }

    // Only proceed if PR author is exactly app/renovate
    if (!analysis.isAppRenovate) {
      return {
        success: false,
        message: `PR #${request.prNumber} is not from app/renovate (author: ${analysis.author})`,
      };
    }

    // Only proceed if no one else has pushed to the branch
    if (!analysis.hasOnlyRenovateCommits) {
      return {
        success: false,
        message: `PR #${request.prNumber} has commits from other authors. Skipping auto-fix.`,
      };
    }

    // Trigger Cursor agent (fire-and-forget)
    const agentResponse = await triggerCursorAgent({
      prNumber: request.prNumber,
      branchName: request.branchName || analysis?.branchName || "unknown",
      repository: request.repository,
      errorDetails: request.errorDetails,
    });

    console.log(
      `Triggered Cursor agent ${agentResponse.agentId} for PR #${request.prNumber}`
    );

    return {
      success: true,
      agentId: agentResponse.agentId,
      message: `Cursor agent triggered successfully for PR #${request.prNumber}. Agent ID: ${agentResponse.agentId}`,
    };
  } catch (error) {
    console.error("Error triggering PR fix:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error triggering Cursor agent",
    };
  }
}
