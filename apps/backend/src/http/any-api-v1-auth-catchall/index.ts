import serverlessExpress from "@vendia/serverless-express";
import { app } from "./auth-app";

export const handler = serverlessExpress({ app });
