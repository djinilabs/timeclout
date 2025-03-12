import express from "express";
import { getTeamShiftsIcal } from "./getTeamShiftsIcal";

export const createApp: () => Promise<express.Application> = async () => {
  const app = express();
  app.get("/api/v1/ical/teams/:teamId/shifts", async (req, res) => {
    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=shifts.ics");
    res.end(await getTeamShiftsIcal(req.params.teamId));
  });
  return app;
};
