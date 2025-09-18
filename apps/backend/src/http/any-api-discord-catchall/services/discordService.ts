import { createVerify } from "crypto";

import { APIGatewayProxyEventV2 } from "aws-lambda";

/**
 * Verify Discord user is authorized to use customer service commands
 */
export function verifyDiscordUser(authorization: {
  user?: { id?: string };
}): boolean {
  const allowedUsersEnv = process.env.DISCORD_CS_USERS;
  if (!allowedUsersEnv) {
    console.error("DISCORD_CS_USERS environment variable not set");
    return false;
  }

  try {
    const allowedUsers: string[] = JSON.parse(allowedUsersEnv);
    const userId = authorization?.user?.id;

    if (!userId) {
      console.warn("No Discord user ID found in authorization");
      return false;
    }

    const isAuthorized = allowedUsers.includes(userId);

    if (!isAuthorized) {
      console.warn(
        `Discord user ${userId} is not authorized for customer service commands`
      );
    } else {
      console.log(
        `Discord user ${userId} is authorized for customer service commands`
      );
    }

    return isAuthorized;
  } catch (error) {
    console.error("Error parsing DISCORD_CS_USERS:", error);
    return false;
  }
}

/**
 * Verify Discord webhook signature using Ed25519
 */
export function verifyDiscordSignature(event: APIGatewayProxyEventV2): boolean {
  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const body = event.body || "";

  if (!signature || !timestamp) {
    console.warn("Missing Discord signature headers");
    return false;
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) {
    console.error("DISCORD_PUBLIC_KEY environment variable not set");
    return false;
  }

  try {
    // Check timestamp to prevent replay attacks
    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp, 10);

    // Reject requests older than 5 minutes
    if (currentTime - requestTime > 300) {
      console.warn("Discord request too old");
      return false;
    }

    // Verify Ed25519 signature
    const verifier = createVerify("ed25519");
    verifier.update(timestamp + body);

    // Convert hex signature to buffer
    const signatureBuffer = Buffer.from(signature, "hex");

    // Convert hex public key to buffer
    const publicKeyBuffer = Buffer.from(publicKey, "hex");

    // Verify the signature
    const isValid = verifier.verify(publicKeyBuffer, signatureBuffer);

    if (!isValid) {
      console.warn("Discord signature verification failed");
      return false;
    }

    console.log("Discord signature verified successfully");
    return true;
  } catch (error) {
    console.error("Error verifying Discord signature:", error);
    return false;
  }
}

/**
 * Create Discord response format
 */
export interface DiscordResponse {
  type: number;
  data?: {
    content?: string;
    flags?: number;
  };
}

export function createDiscordResponse(
  content: string,
  ephemeral: boolean = true
): DiscordResponse {
  return {
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content,
      flags: ephemeral ? 64 : undefined, // EPHEMERAL flag
    },
  };
}
