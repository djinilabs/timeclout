/**
 * PR Analysis Service
 * Optionally gathers error context from diagnostics
 * Note: This is optional - Cursor agent can also run diagnostics itself
 */

import { fetchPRDetails, parseRepository } from "./githubService";

export interface PRAnalysis {
  prNumber: number;
  branchName: string;
  repository: string;
  author: string | null;
  isRenovatePR: boolean;
  errorDetails?: string;
}

/**
 * Analyze PR and gather context
 * This is optional - we can skip diagnostics and let Cursor agent handle it
 */
export async function analyzePR(
  repository: string,
  prNumber: number
): Promise<PRAnalysis | null> {
  try {
    const repoInfo = parseRepository(repository);
    if (!repoInfo) {
      console.error(`Invalid repository format: ${repository}`);
      return null;
    }

    const prDetails = await fetchPRDetails(
      repoInfo.owner,
      repoInfo.repo,
      prNumber
    );

    if (!prDetails) {
      console.error(`Failed to fetch PR #${prNumber}`);
      return null;
    }

    const isRenovatePR =
      prDetails.author?.login.toLowerCase().includes("renovate") ||
      prDetails.author?.login === "renovate[bot]" ||
      prDetails.author?.type === "Bot";

    return {
      prNumber: prDetails.number,
      branchName: prDetails.head.ref,
      repository: prDetails.repository.full_name,
      author: prDetails.author?.login || null,
      isRenovatePR,
      // Error details can be gathered from diagnostics if needed
      // For now, we'll let the Cursor agent run diagnostics itself
    };
  } catch (error) {
    console.error("Error analyzing PR:", error);
    return null;
  }
}
