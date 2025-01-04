import { boomify } from "@hapi/boom";
import { Handler, APIGatewayEvent, Context } from "aws-lambda";

export const handlingErrors = (handler: Handler) => {
  return async (event: APIGatewayEvent, context: Context) => {
    try {
      return await handler(event, context);
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
