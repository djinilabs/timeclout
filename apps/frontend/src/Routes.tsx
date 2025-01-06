import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequiresSession } from "./components/RequiresSession";
import { Root } from "./routes/Root";
import { NewCompany } from "./routes/NewCompany";
import { Company } from "./routes/Company";
import { NewUnit } from "./routes/NewUnit";
import { Unit } from "./routes/Unit";
import { NewTeam } from "./routes/NewTeam";
import { Team } from "./routes/Team";
import { NewTeamInvite } from "./routes/NewTeamInvite";

export const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequiresSession>
              <Root />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/new"
          element={
            <RequiresSession>
              <NewCompany />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company"
          element={
            <RequiresSession>
              <Company />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/new"
          element={
            <RequiresSession>
              <NewUnit />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit"
          element={
            <RequiresSession>
              <Unit />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/new"
          element={
            <RequiresSession>
              <NewTeam />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team"
          element={
            <RequiresSession>
              <Team />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/invites/new"
          element={
            <RequiresSession>
              <NewTeamInvite />
            </RequiresSession>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
