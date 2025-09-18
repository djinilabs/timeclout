import { conflict } from "@hapi/boom";
import { nanoid } from "nanoid";

import { database } from "@/tables";
import { resourceRef } from "@/utils";

export interface CreateDiscordUserOptions {
  email: string;
}

export interface CreateDiscordUserResult {
  success: boolean;
  userPk?: string;
  message?: string;
}

/**
 * Create a user for Discord integration
 * Creates entries in both entity and next-auth tables
 */
export const createDiscordUser = async (
  options: CreateDiscordUserOptions
): Promise<CreateDiscordUserResult> => {
  try {
    const { email } = options;
    const tables = await database();

    // Check if user already exists in next-auth table
    const authUser = (
      await tables["next-auth"].query({
        KeyConditionExpression: "pk = :pk and sk = :sk",
        ExpressionAttributeValues: {
          ":pk": `USER#${email}`,
          ":sk": `USER#${email}`,
        },
      })
    ).items[0];

    if (authUser) {
      throw conflict("User already exists");
    }

    // Generate user ID
    const userPk = nanoid();
    const userRef = resourceRef("users", userPk);

    // Create next-auth entry
    await tables["next-auth"].create({
      pk: `USER#${email}`,
      sk: `USER#${email}`,
      email,
      name: email.split("@")[0], // Derive name from email
      id: userPk,
      createdBy: userRef,
    });

    // Create entity entry
    await tables.entity.create({
      pk: userRef,
      name: email.split("@")[0], // Derive name from email
      email,
      createdBy: userRef,
    });

    console.log(`Discord user created successfully: ${email} (${userPk})`);

    return {
      success: true,
      userPk,
    };
  } catch (error) {
    console.error("Error creating Discord user:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
