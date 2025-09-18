import { createDiscordUser } from "@/business-logic";

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
