import serverlessExpress from "@vendia/serverless-express";
import { createApp } from "./auth-app";

const createHandler = async () => {
  const app = await createApp();
  return serverlessExpress({
    app,
    respondWithErrors: true,
  });
};

export const handler = async (
  ...args: Parameters<ReturnType<typeof serverlessExpress>>
) => {
  const h = await createHandler();
  return h(...args);
};
