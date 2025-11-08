import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";
import { verifyDiscordSignature } from "../any-api-discord/services/discordService";

import { parseRepository } from "./services/githubService";
import { parseDiscordMessage } from "./services/messageParser";
import { triggerPRFix } from "./services/prFixService";

/**
 * Discord Message Handler
 * Receives Discord messages about failed CI workflows
 * Triggers Cursor agent to fix Renovate PR failures
 */
export const handler = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Verify Discord webhook signature (if using webhooks)
    // For Gateway bots, this might not be present, so we'll make it optional
    const signature = event.headers["x-signature-ed25519"];
    if (signature) {
      if (!verifyDiscordSignature(event)) {
        console.warn("Discord signature verification failed");
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: "Invalid Discord signature",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      }
    }

    // Parse Discord message payload
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (error) {
      console.error("Error parsing Discord message payload:", error);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid JSON payload",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Handle Discord interaction types (for Gateway bots)
    if (body.type === 1) {
      // PING - Discord verification
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 1 }), // PONG
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Parse Discord message to extract PR information
    const parsedInfo = parseDiscordMessage(body);

    // Log parsed information for debugging
    console.log("Parsed Discord message:", {
      prNumber: parsedInfo.prNumber,
      branchName: parsedInfo.branchName,
      workflowStatus: parsedInfo.workflowStatus,
      repository: parsedInfo.repository,
      isValid: parsedInfo.isValid,
    });

    // Only process if we have valid PR info and it's a failed workflow
    if (!parsedInfo.isValid) {
      console.log("Discord message does not contain valid PR failure information");
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Message processed but no action taken (not a failed PR)",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Validate repository format
    if (!parsedInfo.repository) {
      console.error("Repository information missing from Discord message");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Repository information missing",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    const repoInfo = parseRepository(parsedInfo.repository);
    if (!repoInfo) {
      console.error(`Invalid repository format: ${parsedInfo.repository}`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Invalid repository format: ${parsedInfo.repository}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Trigger Cursor agent to fix the PR (fire-and-forget)
    try {
      const result = await triggerPRFix({
        prNumber: parsedInfo.prNumber!,
        branchName: parsedInfo.branchName || "unknown",
        repository: parsedInfo.repository,
      });

      if (result.success) {
        console.log(
          `Successfully triggered Cursor agent for PR #${parsedInfo.prNumber}`
        );
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: result.message,
            agentId: result.agentId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      } else {
        console.error(`Failed to trigger Cursor agent: ${result.message}`);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: result.message,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      }
    } catch (error) {
      console.error("Error triggering PR fix:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
  }
);
