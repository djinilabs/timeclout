import { useEffect, useState } from "react";
import { useFetchActivity } from "../../hooks/useFetchActivity";
import { Loading } from "../particles/Loading";

export const FetchActivityIndicator = () => {
  const { monitorFetch } = useFetchActivity();
  const [pendingOperationCount, setPendingOperationCount] = useState(0);

  useEffect(() => {
    const subscription = monitorFetch.pendingOperationCount$.subscribe(
      (count) => {
        setPendingOperationCount(count);
      }
    );
    return () => subscription.unsubscribe();
  }, [monitorFetch.pendingOperationCount$]);

  if (pendingOperationCount === 0) {
    return null;
  }
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <Loading />
    </div>
  );
};
