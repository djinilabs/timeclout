import { boomify } from "@hapi/boom";
import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context,
} from "aws-lambda";

export const handlingErrors = (handler: APIGatewayProxyHandlerV2) => {
  return async (event: APIGatewayProxyEventV2, context: Context, callback) => {
    try {
      return await handler(event, context, callback);
    } catch (error) {
      const boomed = boomify(error);
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
