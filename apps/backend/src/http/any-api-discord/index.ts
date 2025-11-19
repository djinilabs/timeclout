import { badRequest, methodNotAllowed } from "@hapi/boom";
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";

import { handleDiscordCommand } from "./services/commandHandler";
import { discordResponse } from "./services/discordResponse";
import {
  verifyDiscordSignature,
  verifyDiscordUser,
} from "./services/discordService";

export const handler = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      throw methodNotAllowed("Method not allowed");
    }

    // Verify Discord webhook signature
    if (!verifyDiscordSignature(event)) {
      console.warn("Discord signature verification failed");
      return discordResponse(
        "❌ **Error:** Invalid Discord signature. Request could not be verified."
      );
    }

    // Parse Discord webhook payload
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      throw badRequest("Invalid JSON payload. Request could not be parsed.");
    }

    // Handle Discord interaction
    if (body.type === 1) {
      // PING - Discord verification
      return discordResponse("🤖");
    }

    if (body.type === 2) {
      // APPLICATION_COMMAND - Handle slash command
      // Verify Discord user is authorized for customer service commands
      if (!verifyDiscordUser(body.member || body.user)) {
        return discordResponse(
          "❌ You are not authorized to use customer service commands."
        );
      }

      return await handleDiscordCommand(body);
    }

    // Unknown interaction type
    return discordResponse("❌ **Error:** Unknown interaction type.", 200);
  }
);
