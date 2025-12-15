import { createHash } from "crypto";

import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/**
 * Initialize PostHog client singleton.
 * Returns null if PostHog is not configured (graceful degradation).
 */
export const getPostHogClient = (): PostHog | null => {
  // Return existing client if already initialized
  if (posthogClient) {
    return posthogClient;
  }

  // Check if PostHog is configured
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Initialize PostHog client
  const host = process.env.POSTHOG_HOST || "https://eu.i.posthog.com";

  posthogClient = new PostHog(apiKey, {
    host,
    // Flush events immediately in Lambda (don't batch)
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
};

/**
 * Hashes a user ID using SHA-256 and returns the hex representation.
 * Used to create pseudonymous user identifiers without sending PII.
 * This matches the frontend implementation in PostHogTracker.tsx.
 */
export const hashUserId = (userId: string): string => {
  return createHash("sha256").update(userId).digest("hex");
};

/**
 * Flush PostHog events to ensure they are sent before Lambda completes.
 * This is critical in Lambda environments where the function may terminate
 * before events are sent. Use this before returning from a handler.
 *
 * Note: This calls shutdown() which closes the client. If the Lambda container
 * is reused, the client will be reinitialized on the next getPostHogClient() call.
 */
export const flushPostHog = async (): Promise<void> => {
  if (posthogClient) {
    try {
      // Flush with timeout to prevent hanging (2 seconds max)
      await Promise.race([
        posthogClient.shutdown(),
        new Promise<void>((resolve) => {
          setTimeout(() => {
            console.warn("PostHog flush timeout, events may be lost");
            resolve();
          }, 2000);
        }),
      ]);
      // Reset client so it can be reinitialized if container is reused
      posthogClient = null;
    } catch (error) {
      // Don't fail the request if PostHog flush fails
      console.error("Failed to flush PostHog:", error);
      // Reset client on error to allow reinitialization
      posthogClient = null;
    }
  }
};

/**
 * Shutdown PostHog client gracefully.
 * Should be called when Lambda is shutting down (optional but recommended).
 */
export const shutdownPostHog = async (): Promise<void> => {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
};
