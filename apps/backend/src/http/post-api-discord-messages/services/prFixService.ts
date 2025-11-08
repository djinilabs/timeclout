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

    // Optionally analyze PR to get more context
    // This is optional - Cursor agent can also fetch PR details itself
    const analysis = await analyzePR(request.repository, request.prNumber);

    if (analysis && !analysis.isRenovatePR) {
      return {
        success: false,
        message: `PR #${request.prNumber} is not from Renovate bot (author: ${analysis.author})`,
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
