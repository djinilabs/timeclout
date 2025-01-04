import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./routes/Root";
import { RequiresSession } from "./components/RequiresSession";
import { NewCompany } from "./routes/NewCompany";
import { Company } from "./routes/Company";
import { NewUnit } from "./routes/NewUnit";

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
              <Root />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team"
          element={
            <RequiresSession>
              <Root />
            </RequiresSession>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
