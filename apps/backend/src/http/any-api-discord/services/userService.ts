import { createDiscordUser } from "@/business-logic";
import { database } from "@/tables";
import { resourceRef } from "@/utils";

/**
 * Create a new user via Discord command
 * Uses business logic to create both entity and next-auth entries
 */
export async function createUser(email: string): Promise<void> {
  const result = await createDiscordUser({ email });

  if (!result.success) {
    throw new Error(result.message || "Failed to create user");
  }
}

/**
 * Disable a user account via Discord command
 * Finds user by email in next-auth table, then disables the entity
 */
export async function disableUser(email: string): Promise<void> {
  const tables = await database();

  // Find user in next-auth table by email
  const authUser = (
    await tables["next-auth"].query({
      KeyConditionExpression: "pk = :pk and sk = :sk",
      ExpressionAttributeValues: {
        ":pk": `USER#${email}`,
        ":sk": `USER#${email}`,
      },
    })
  ).items[0];

  if (!authUser) {
    throw new Error(`User with email ${email} not found`);
  }

  // Get the user ID from the next-auth record
  const userId = authUser.id;
  const userRef = resourceRef("users", userId);

  // Get the entity record
  const entityRecord = await tables.entity.get(userRef);
  if (!entityRecord) {
    throw new Error(`Entity record not found for user ${email}`);
  }

  // Update the entity to set disabled = true
  await tables.entity.update({
    ...entityRecord,
    disabled: true,
    updatedAt: new Date().toISOString(),
    updatedBy: "discord-bot",
  });
}
