import { boomify } from "@hapi/boom";
import { captureException, flush } from "@sentry/aws-serverless";
import { SQSBatchResponse, SQSEvent } from "aws-lambda";

export type QueueEventHandler<T extends object> = (payload: T) => Promise<void>;

export const handleQueueEvent = async <T extends object>(
  event: SQSEvent,
  handler: QueueEventHandler<T>
): Promise<SQSBatchResponse> => {
  const results = await Promise.allSettled(
    event.Records?.map((record) => {
      return new Promise((resolve, reject) => {
        const payload = JSON.parse(record.body);
        try {
          handler(payload)
            .then((result) => resolve(result))
            .catch((err) => {
              const originalError = err instanceof Error ? err : new Error(String(err));
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

              console.error("Error processing event", payload, err);
              reject(err);
            });
        } catch (error) {
          const originalError = error instanceof Error ? error : new Error(String(error));
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

          console.error("Error processing event", payload, error);
          reject(error);
        }
      });
    }) ?? []
  );

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

  return {
    batchItemFailures: results
      .flatMap((result, resultIndex) =>
        result.status === "rejected"
          ? [event.Records[resultIndex].messageId]
          : []
      )
      .map((messageId) => ({
        itemIdentifier: messageId,
      })),
  };
};
