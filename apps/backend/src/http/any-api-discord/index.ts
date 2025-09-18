import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";

import { handleDiscordCommand } from "./services/commandHandler";
import {
  verifyDiscordSignature,
  verifyDiscordUser,
} from "./services/discordService";

const reply = (content: string, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify({
      type: 4,
      data: {
        content,
        flags: 64, // EPHEMERAL
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-api-docs, v0.1.0)",
    },
  };
};

export const handler = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      return reply("Method not allowed", 405);
    }

    // Verify Discord webhook signature
    if (!verifyDiscordSignature(event)) {
      console.warn("Discord signature verification failed");
      return reply(
        "❌ **Error:** Invalid Discord signature. Request could not be verified."
      );
    }

    // Parse Discord webhook payload
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (error) {
      console.error("Error parsing Discord webhook payload:", error);
      return reply(
        "❌ **Error:** Invalid JSON payload. Request could not be parsed."
      );
    }

    // Handle Discord interaction
    if (body.type === 1) {
      // PING - Discord verification
      return reply("🤖");
    }

    if (body.type === 2) {
      // APPLICATION_COMMAND - Handle slash command
      // Verify Discord user is authorized for customer service commands
      if (!verifyDiscordUser(body.member || body.user)) {
        return reply(
          "❌ You are not authorized to use customer service commands."
        );
      }

      return await handleDiscordCommand(body);
    }

    // Unknown interaction type
    return reply("❌ **Error:** Unknown interaction type.", 200);
  }
);
