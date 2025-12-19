import { boomify } from "@hapi/boom";
import {
  init,
  wrapHandler,
  captureException,
  flush,
} from "@sentry/aws-serverless";
import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";

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

export const handlingErrors = (
  userHandler: APIGatewayProxyHandlerV2
): APIGatewayProxyHandlerV2 => {
  const handler = wrapHandler(userHandler);
  return async (
    event: APIGatewayProxyEventV2,
    context: Context,
    callback: Callback
  ): Promise<APIGatewayProxyResult | string> => {
    try {
      return (await handler(event, context, callback)) as
        | APIGatewayProxyResult
        | string;
    } catch (error) {
      const boomed = boomify(
        error != null && typeof error === "object"
          ? error
          : new Error(String(error))
      );

      // Report server errors (5xx) to Sentry
      // User errors (4xx) are not reported as they are expected client errors
      if (boomed.isServer && process.env.SENTRY_DSN) {
        try {
          captureException(boomed);
        } catch (sentryError) {
          // Don't fail the request if Sentry reporting fails
          console.error("Failed to capture exception to Sentry:", sentryError);
        }
      }

      if (boomed.isServer) {
        console.error(boomed);
      } else {
        console.warn(boomed);
      }

      const { statusCode, headers, payload } = boomed.output;

      // Update the payload with the translated message
      const updatedPayload = {
        ...payload,
        message: boomed.message,
      };

      // Ensure API error responses have proper headers to prevent CloudFront
      // from serving custom error pages (index.html) for 403/404 responses
      const responseHeaders = {
        ...headers,
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      } as Record<string, string | number | boolean>;

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
        statusCode,
        headers: responseHeaders,
        body: JSON.stringify(updatedPayload),
      };
    }
  };
};
