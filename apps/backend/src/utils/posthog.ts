import { createHash } from "crypto";

import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;
let isShuttingDown = false;

// Default timeout for PostHog flush operations (configurable via env var)
const POSTHOG_FLUSH_TIMEOUT_MS = Number(
  process.env.POSTHOG_FLUSH_TIMEOUT_MS || "5000"
);

/**
 * Initialize PostHog client singleton.
 * Returns null if PostHog is not configured (graceful degradation).
 */
export const getPostHogClient = (): PostHog | null => {
  // Don't create new client if one is shutting down (prevent race condition)
  if (isShuttingDown) {
    return null;
  }

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
  if (!posthogClient || isShuttingDown) {
    return;
  }

  // Mark as shutting down to prevent race conditions
  isShuttingDown = true;
  const client = posthogClient;
  posthogClient = null;

  try {
    // Flush with timeout to prevent hanging
    await Promise.race([
      client.shutdown(),
      new Promise<void>((resolve) => {
        setTimeout(() => {
          console.warn(
            `PostHog flush timeout after ${POSTHOG_FLUSH_TIMEOUT_MS}ms, events may be lost`
          );
          resolve();
        }, POSTHOG_FLUSH_TIMEOUT_MS);
      }),
    ]);
  } catch (error) {
    // Don't fail the request if PostHog flush fails
    console.error("Failed to flush PostHog:", error);
  } finally {
    // Reset shutdown flag so client can be reinitialized if container is reused
    isShuttingDown = false;
  }
};

/**
 * Shutdown PostHog client gracefully.
 * Should be called when Lambda is shutting down (optional but recommended).
 */
export const shutdownPostHog = async (): Promise<void> => {
  if (!posthogClient || isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  const client = posthogClient;
  posthogClient = null;

  try {
    await client.shutdown(POSTHOG_FLUSH_TIMEOUT_MS);
  } catch (error) {
    console.error("Failed to shutdown PostHog:", error);
  } finally {
    isShuttingDown = false;
  }
};
