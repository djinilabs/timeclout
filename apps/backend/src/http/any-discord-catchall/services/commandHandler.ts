import { APIGatewayProxyResult } from "aws-lambda";

import { createDiscordResponse } from "./discordService";
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
          body: JSON.stringify(createDiscordResponse("❌ Unknown command")),
        };
    }
  } catch (error) {
    console.error("Error handling Discord command:", error);
    return {
      statusCode: 200,
      body: JSON.stringify(
        createDiscordResponse(
          "❌ An error occurred while processing your request. Please try again."
        )
      ),
    };
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
    return {
      statusCode: 200,
      body: JSON.stringify(
        createDiscordResponse("❌ Email parameter is required")
      ),
    };
  }

  const email = emailOption.value;

  // Validate email format
  if (!isValidEmail(email)) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        createDiscordResponse("❌ Please provide a valid email address")
      ),
    };
  }

  try {
    // Create user
    await createUser(email);

    return {
      statusCode: 200,
      body: JSON.stringify(
        createDiscordResponse(
          `✅ User **${email}** has been successfully added and can now log in.`
        )
      ),
    };
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          createDiscordResponse(
            `❌ User with email **${email}** already exists.`
          )
        ),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        createDiscordResponse("❌ Failed to create user. Please try again.")
      ),
    };
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
