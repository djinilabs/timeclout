import { FC } from "react";
import { AppLayout } from "./AppLayout";
import { AppRoutes } from "./Routes";

export const App: FC = () => {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
};
