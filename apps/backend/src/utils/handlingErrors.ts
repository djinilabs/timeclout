import { boomify } from "@hapi/boom";
import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context,
  Callback,
} from "aws-lambda";
import { wrapHandler } from "@sentry/aws-serverless";

export const handlingErrors = (userHandler: APIGatewayProxyHandlerV2) => {
  const handler = wrapHandler(userHandler);
  return async (
    event: APIGatewayProxyEventV2,
    context: Context,
    callback: Callback
  ) => {
    try {
      return await handler(event, context, callback);
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
        headers,
        body: JSON.stringify(payload),
      };
    }
  };
};
