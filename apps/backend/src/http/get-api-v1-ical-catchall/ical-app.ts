import express from "express";

import { getTeamLeavesIcal } from "./getTeamLeavesIcal";
import { getTeamShiftsIcal } from "./getTeamShiftsIcal";

export const createApp: () => Promise<express.Application> = async () => {
  const app = express();

  // teah shifts
  app.get("/api/v1/ical/teams/:teamId/shifts", async (request, response) => {
    response.setHeader("Content-Type", "text/calendar");
    response.setHeader("Content-Disposition", "attachment; filename=shifts.ics");
    response.end(await getTeamShiftsIcal(request.params.teamId));
  });

  // team leaves
  app.get("/api/v1/ical/teams/:teamId/leaves", async (request, response) => {
    response.setHeader("Content-Type", "text/calendar");
    response.setHeader("Content-Disposition", "attachment; filename=leaves.ics");
    response.end(await getTeamLeavesIcal(request.params.teamId));
  });

  return app;
};
