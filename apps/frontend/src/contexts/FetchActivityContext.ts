import { createContext } from "react";
import { of } from "rxjs";

import { MonitorActivityFetch } from "../utils/monitorActivityFetch";

export const FetchActivityContext = createContext<{
  monitorFetch: MonitorActivityFetch;
}>({
  monitorFetch: {
    fetch: fetch,
    pendingOperationCount$: of(0),
  },
});
