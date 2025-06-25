import { useEffect, useState } from "react";
import { useFetchActivity } from "./useFetchActivity";

export const useIsFetching = () => {
  const activity = useFetchActivity();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const subscription = activity.monitorFetch.pendingOperationCount$.subscribe(
      (count) => {
        setIsFetching(count > 0);
      }
    );
    return () => subscription.unsubscribe();
  }, [activity.monitorFetch.pendingOperationCount$]);

  return isFetching;
};
