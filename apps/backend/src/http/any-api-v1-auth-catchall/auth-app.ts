import { ExpressAuth } from "@auth/express";
import express from "express";
import { authConfig } from "@/auth-config";

export const createApp: () => Promise<express.Application> = async () => {
  const app = express();
  app.set("trust proxy", true);
  app.use("/api/v1/auth/*", ExpressAuth(await authConfig()));
  return app;
};
