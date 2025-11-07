import { MonitorActivityFetch } from "../../utils/monitorActivityFetch";
import { timeout } from "../../utils/timeout";

const INITIAL_TIMEOUT_MS = 500;

export const ActivityDebouncer = (
  activityMonitor: MonitorActivityFetch
): {
  debounceActivity: () => Promise<void>;
} => {
  const { pendingOperationCount$ } = activityMonitor;

  return {
    debounceActivity: async () => {
      await timeout(INITIAL_TIMEOUT_MS);
      return new Promise((resolve) => {
        pendingOperationCount$.subscribe((count) => {
          if (count === 0) {
            resolve();
          }
        });
      });
    },
  };
};
