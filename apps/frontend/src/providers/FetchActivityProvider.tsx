import { FC, PropsWithChildren } from "react";

import { FetchActivityContext } from "../contexts/FetchActivityContext";
import { MonitorActivityFetch } from "../utils/monitorActivityFetch";

export interface FetchActivityProviderProps {
  monitorFetch: MonitorActivityFetch;
}

export const FetchActivityProvider: FC<
  PropsWithChildren<FetchActivityProviderProps>
> = ({ children, monitorFetch }) => {
  return (
    <FetchActivityContext.Provider value={{ monitorFetch }}>
      {children}
    </FetchActivityContext.Provider>
  );
};
