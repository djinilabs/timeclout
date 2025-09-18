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

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return {
      statusCode: 200,
      body: JSON.stringify(
        createDiscordResponse(
          `❌ **Error processing command:** ${errorMessage}\n\nPlease try again or contact support if the issue persists.`
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

    // Provide more specific error messages based on the error type
    let errorMessage = "Failed to create user. Please try again.";

    if (error instanceof Error) {
      if (error.message.includes("validation")) {
        errorMessage = `❌ **Validation Error:** ${error.message}`;
      } else if (
        error.message.includes("database") ||
        error.message.includes("connection")
      ) {
        errorMessage =
          "❌ **Database Error:** Unable to connect to the database. Please try again later.";
      } else if (
        error.message.includes("permission") ||
        error.message.includes("unauthorized")
      ) {
        errorMessage =
          "❌ **Permission Error:** You don't have permission to perform this action.";
      } else {
        errorMessage = `❌ **Error:** ${error.message}`;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(createDiscordResponse(errorMessage)),
    };
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
