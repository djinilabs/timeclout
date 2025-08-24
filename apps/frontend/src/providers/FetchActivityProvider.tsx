import { FC, PropsWithChildren } from "react";

import { FetchActivityContext } from "../contexts/FetchActivityContext";
import { MonitorActivityFetch } from "../utils/monitorActivityFetch";

export interface FetchActivityProviderProperties {
  monitorFetch: MonitorActivityFetch;
}

export const FetchActivityProvider: FC<
  PropsWithChildren<FetchActivityProviderProperties>
> = ({ children, monitorFetch }) => {
  return (
    <FetchActivityContext.Provider value={{ monitorFetch }}>
      {children}
    </FetchActivityContext.Provider>
  );
};
