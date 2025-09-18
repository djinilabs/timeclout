import { APIGatewayProxyResult } from "aws-lambda";

import packageJson from "../../../../package.json";

import { discordResponse } from "./discordResponse";
import { createUser } from "./userService";

interface DiscordInteraction {
  data: {
    name: string;
    options?: Array<{
      name: string;
      value: string;
    }>;
  };
}

export async function handleDiscordCommand(
  interaction: DiscordInteraction
): Promise<APIGatewayProxyResult> {
  const commandName = interaction.data.name;

  try {
    switch (commandName) {
      case "adduser":
        return await handleAddUserCommand(interaction);
      default:
        return {
          statusCode: 200,
          body: JSON.stringify(discordResponse("❌ Unknown command")),
          headers: {
            "Content-Type": "application/json",
            "User-Agent": `DiscordBot (https://app.tt3.app, ${packageJson.version})`,
          },
        };
    }
  } catch (error) {
    console.error("Error handling Discord command:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return discordResponse(`❌ **Error:** ${errorMessage}`);
  }
}

async function handleAddUserCommand(
  interaction: DiscordInteraction
): Promise<APIGatewayProxyResult> {
  // Extract email from command options
  const emailOption = interaction.data.options?.find(
    (option) => option.name === "email"
  );

  if (!emailOption) {
    return discordResponse("❌ Email parameter is required");
  }

  const email = emailOption.value;

  // Validate email format
  if (!isValidEmail(email)) {
    return discordResponse("❌ Please provide a valid email address");
  }

  try {
    // Create user
    await createUser(email);

    return discordResponse(
      `✅ User **${email}** has been successfully added and can now log in.`
    );
  } catch (error) {
    console.error("Error creating user:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return discordResponse(`❌ **Error:** ${errorMessage}`);
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
