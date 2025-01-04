import { ExpressAuth } from "@auth/express";
import express from "express";
import { tables } from "@architect/functions";
import { authConfig } from "@/auth-config";

export const createApp = async () => {
  const app = express();
  app.set("trust proxy", true);
  app.use("/api/v1/auth/*", ExpressAuth(await authConfig()));
  return app;
};
