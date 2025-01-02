import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./routes/Root";
import { RequiresSession } from "./components/RequiresSession";
import { NewCompany } from "./routes/NewCompany";

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
          path="/c/new"
          element={
            <RequiresSession>
              <NewCompany />
            </RequiresSession>
          }
        />
        <Route
          path="/c/:company"
          element={
            <RequiresSession>
              <Root />
            </RequiresSession>
          }
        />
        <Route
          path="/c/:company/u/:unit"
          element={
            <RequiresSession>
              <Root />
            </RequiresSession>
          }
        />
        <Route
          path="/c/:company/u/:unit/t/:team"
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
