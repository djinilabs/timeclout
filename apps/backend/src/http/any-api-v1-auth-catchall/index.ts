import serverlessExpress from "@vendia/serverless-express";
import { createApp } from "./auth-app";
import { handlingErrors } from "../../utils/handlingErrors";

const createHandler = async () => {
  const app = await createApp();
  return handlingErrors(
    serverlessExpress({
      app,
      respondWithErrors: true,
    })
  );
};

export const handler = async (
  ...args: Parameters<ReturnType<typeof serverlessExpress>>
) => {
  const h = await createHandler();
  return h(...args);
};
