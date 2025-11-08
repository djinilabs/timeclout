/**
 * Parses Discord embed messages to extract PR information from CI workflow notifications
 */

export interface ParsedPRInfo {
  prNumber: number | null;
  branchName: string | null;
  workflowStatus: "FAILED" | "SUCCESS" | "CANCELLED" | "UNKNOWN";
  author: string | null;
  repository: string | null;
  isValid: boolean;
}

interface DiscordMessageBody {
  embeds?: Array<{
    title?: string;
    description?: string;
    fields?: Array<{
      name?: string;
      value?: string;
    }>;
  }>;
  type?: number;
  content?: string;
}

/**
 * Parse Discord message to extract PR information
 * Discord messages from CI workflows typically have embeds with structured data
 */
export function parseDiscordMessage(body: DiscordMessageBody): ParsedPRInfo {
  const result: ParsedPRInfo = {
    prNumber: null,
    branchName: null,
    workflowStatus: "UNKNOWN",
    author: null,
    repository: null,
    isValid: false,
  };

  try {
    // Check if this is a message with embeds (from webhook)
    if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
      const embed = body.embeds[0];

      // Extract workflow status from embed title or fields
      if (embed.title) {
        // Title format: "❌ Workflow Name - FAILED" or "✅ Workflow Name - SUCCESS"
        if (embed.title.includes("❌") || embed.title.includes("FAILED")) {
          result.workflowStatus = "FAILED";
        } else if (embed.title.includes("✅") || embed.title.includes("SUCCESS")) {
          result.workflowStatus = "SUCCESS";
        } else if (embed.title.includes("⏹️") || embed.title.includes("CANCELLED")) {
          result.workflowStatus = "CANCELLED";
        }
      }

      // Extract information from embed fields
      if (embed.fields && Array.isArray(embed.fields)) {
        for (const field of embed.fields) {
          const fieldValue = field.value || "";
          const fieldName = field.name || "";

          // Extract PR number from PR/Event field
          // Format: "🔗 **PR #123**: [Title](URL)" or "PR #123"
          if (
            fieldName.includes("PR") ||
            fieldName.includes("Event") ||
            fieldValue.includes("PR #")
          ) {
            const prMatch = fieldValue.match(/PR\s*#(\d+)/i);
            if (prMatch) {
              result.prNumber = parseInt(prMatch[1], 10);
            }
          }

          // Extract branch name from Branch field
          if (fieldName.includes("Branch") || fieldName.includes("branch")) {
            // Remove markdown formatting if present
            const branchMatch = fieldValue.match(/(?:refs\/heads\/)?([^\s`]+)/);
            if (branchMatch) {
              result.branchName = branchMatch[1].replace(/[`*]/g, "");
            }
          }

          // Extract repository from Repository field
          if (fieldName.includes("Repository") || fieldName.includes("repository")) {
            // Format: "owner/repo" or just the text
            const repoMatch = fieldValue.match(/([^\s`/]+)\/([^\s`/]+)/);
            if (repoMatch) {
              result.repository = repoMatch[0].replace(/[`*]/g, "");
            } else {
              result.repository = fieldValue.replace(/[`*]/g, "").trim();
            }
          }
        }
      }

      // Also check embed description for PR info
      if (embed.description) {
        const prMatch = embed.description.match(/PR\s*#(\d+)/i);
        if (prMatch && !result.prNumber) {
          result.prNumber = parseInt(prMatch[1], 10);
        }
      }
    }

    // Check if this is a message_create event (from Gateway)
    if (body.type === 0 && body.content) {
      // Try to extract PR info from message content
      const prMatch = body.content.match(/PR\s*#(\d+)/i);
      if (prMatch) {
        result.prNumber = parseInt(prMatch[1], 10);
      }

      // Check for failure indicators in content
      if (
        body.content.includes("❌") ||
        body.content.includes("FAILED") ||
        body.content.includes("failed")
      ) {
        result.workflowStatus = "FAILED";
      }
    }

    // Validate that we have at least a PR number and failed status
    result.isValid =
      result.prNumber !== null &&
      result.workflowStatus === "FAILED" &&
      result.branchName !== null;

    return result;
  } catch (error) {
    console.error("Error parsing Discord message:", error);
    return result;
  }
}

/**
 * Check if the PR is from Renovate bot
 * This should be checked separately using GitHub API since Discord embeds may not always include author info
 */
export function isRenovatePR(author: string | null): boolean {
  if (!author) return false;
  return (
    author.toLowerCase().includes("renovate") ||
    author === "app/renovate" ||
    author === "renovate[bot]"
  );
}
