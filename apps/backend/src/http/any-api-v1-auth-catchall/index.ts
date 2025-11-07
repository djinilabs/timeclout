import serverlessExpress from "@vendia/serverless-express";
import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";

import { createApp } from "./auth-app";


let cachedHandler: APIGatewayProxyHandlerV2 | undefined;

const createHandler = async (): Promise<APIGatewayProxyHandlerV2> => {
  if (cachedHandler) {
    return cachedHandler;
  }
  const app = await createApp();
  const handler = handlingErrors(
    serverlessExpress({
      app,
      respondWithErrors: true,
    })
  );
  cachedHandler = handler;
  return handler;
};

export const handler: APIGatewayProxyHandlerV2 = async (...args) => {
  const h: APIGatewayProxyHandlerV2 = await createHandler();
  return h(...args) as Promise<APIGatewayProxyResultV2>;
};
