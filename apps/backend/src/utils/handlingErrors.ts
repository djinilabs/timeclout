import { boomify } from "@hapi/boom";
import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";
import { init, wrapHandler } from "@sentry/aws-serverless";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

if (process.env.NODE_ENV === "production") {
  init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE),
    profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE),
    integrations: [nodeProfilingIntegration()],
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
      if (boomed.isServer) {
        console.error(boomed);
      } else {
        console.warn(boomed);
      }
      const { statusCode, headers, payload } = boomed.output;
      return {
        statusCode,
        headers: headers as Record<string, string | number | boolean>,
        body: JSON.stringify(payload),
      };
    }
  };
};
