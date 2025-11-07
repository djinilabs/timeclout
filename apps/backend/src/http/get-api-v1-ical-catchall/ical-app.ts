import express from "express";

import { getTeamLeavesIcal } from "./getTeamLeavesIcal";
import { getTeamShiftsIcal } from "./getTeamShiftsIcal";

export const createApp: () => Promise<express.Application> = async () => {
  const app = express();

  // teah shifts
  app.get("/api/v1/ical/teams/:teamId/shifts", async (req, res) => {
    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=shifts.ics");
    res.end(await getTeamShiftsIcal(req.params.teamId));
  });

  // team leaves
  app.get("/api/v1/ical/teams/:teamId/leaves", async (req, res) => {
    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=leaves.ics");
    res.end(await getTeamLeavesIcal(req.params.teamId));
  });

  return app;
};
