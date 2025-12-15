import { PostHog } from "posthog-node";
import { createHash } from "crypto";

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
  const host =
    process.env.POSTHOG_HOST || "https://eu.i.posthog.com";

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
 * Shutdown PostHog client gracefully.
 * Should be called when Lambda is shutting down (optional but recommended).
 */
export const shutdownPostHog = async (): Promise<void> => {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
};

