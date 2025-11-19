import { boomify } from "@hapi/boom";
import { init, captureException, flush } from "@sentry/aws-serverless";
import { SQSEvent, SQSBatchResponse } from "aws-lambda";

// Initialize Sentry in all environments (DSN can be empty in non-production)
if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || "1.0"),
    profilesSampleRate: Number(
      process.env.SENTRY_PROFILES_SAMPLE_RATE || "1.0"
    ),
  });
}

export type QueueHandler = (event: SQSEvent) => Promise<SQSBatchResponse>;

/**
 * Wraps a queue handler to catch errors, report server errors to Sentry, and flush before returning.
 * This ensures all non-user errors are sent to Sentry in Lambda environment.
 */
export const handlingQueueErrors = (
  userHandler: QueueHandler
): QueueHandler => {
  return async (event: SQSEvent): Promise<SQSBatchResponse> => {
    try {
      return await userHandler(event);
    } catch (error) {
      const originalError =
        error instanceof Error ? error : new Error(String(error));
      const boomed = boomify(originalError);

      // Report server errors (5xx) to Sentry
      // User errors (4xx) are not reported as they are expected client errors
      if (boomed.isServer && process.env.SENTRY_DSN) {
        try {
          captureException(originalError);
        } catch (sentryError) {
          // Don't fail the request if Sentry reporting fails
          console.error("Failed to capture exception to Sentry:", sentryError);
        }
      }

      if (boomed.isServer) {
        console.error("Queue handler error:", boomed);
      } else {
        console.warn("Queue handler error:", boomed);
      }

      // Flush Sentry before returning response (critical for Lambda)
      // Use timeout to prevent hanging (2 seconds max)
      if (process.env.SENTRY_DSN) {
        try {
          await flush(2000);
        } catch (flushError) {
          // Don't fail the request if Sentry flush fails
          console.error("Failed to flush Sentry:", flushError);
        }
      }

      // Re-throw the error so the caller can handle it appropriately
      throw boomed;
    }
  };
};
