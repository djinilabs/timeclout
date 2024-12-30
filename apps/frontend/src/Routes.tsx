import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./routes/Root";
import { RequiresSession } from "./components/RequiresSession";

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
          path="/d/:domain"
          element={
            <RequiresSession>
              <Root />
            </RequiresSession>
          }
        />
        <Route
          path="/d/:domain/o/:organization"
          element={
            <RequiresSession>
              <Root />
            </RequiresSession>
          }
        />
        <Route
          path="/d/:domain/o/:organization/t/:team"
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
