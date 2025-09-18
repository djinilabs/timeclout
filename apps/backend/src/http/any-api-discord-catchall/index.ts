import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";

import { handleDiscordCommand } from "./services/commandHandler";
import {
  verifyDiscordSignature,
  verifyDiscordUser,
} from "./services/discordService";

export const handler = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    console.log("🔍 Event:", event);
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      console.log("🔍 Method not allowed:", event.requestContext.http.method);
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Verify Discord webhook signature
    if (!verifyDiscordSignature(event)) {
      console.log("🔍 Unauthorized:", event);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    // Parse Discord webhook payload
    const body = JSON.parse(event.body || "{}");
    console.log("🔍 Body:", body);

    // Handle Discord interaction
    if (body.type === 1) {
      // PING - Discord verification
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 1 }),
      };
    }

    if (body.type === 2) {
      // APPLICATION_COMMAND - Handle slash command
      // Verify Discord user is authorized for customer service commands
      if (!verifyDiscordUser(body.member || body.user)) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            type: 4,
            data: {
              content:
                "❌ You are not authorized to use customer service commands.",
              flags: 64, // EPHEMERAL
            },
          }),
        };
      }

      return await handleDiscordCommand(body);
    }

    // Unknown interaction type
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Unknown interaction type" }),
    };
  }
);
