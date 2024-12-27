import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./routes/Root";

export const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/d/:domain" element={<Root />} />
        <Route path="/d/:domain/o/:organization" element={<Root />} />
        <Route path="/d/:domain/o/:organization/t/:team" element={<Root />} />
      </Routes>
    </BrowserRouter>
  );
};
