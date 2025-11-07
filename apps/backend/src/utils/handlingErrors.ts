import { boomify } from "@hapi/boom";
import { init, wrapHandler } from "@sentry/aws-serverless";
import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";

if (process.env.NODE_ENV === "production") {
  init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE),
    profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE),
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
      const boomed = boomify(error as Error);

      // Try to translate the error message if it's a translatable message
      let translatedMessage = boomed.message;
      try {
        // Check if the message looks like a translatable message (contains t`...`)
        if (boomed.message && !boomed.message.includes("t`")) {
          // For now, we'll keep the original message
          // In the future, we can implement more sophisticated translation logic
          translatedMessage = boomed.message;
        }
      } catch (translationError) {
        console.warn("Failed to translate error message:", translationError);
        translatedMessage = boomed.message;
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
        message: translatedMessage,
      };

      return {
        statusCode,
        headers: headers as Record<string, string | number | boolean>,
        body: JSON.stringify(updatedPayload),
      };
    }
  };
};
