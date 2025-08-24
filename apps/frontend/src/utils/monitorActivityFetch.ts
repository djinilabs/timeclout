import { BehaviorSubject, Observable, debounceTime } from "rxjs";

export interface MonitorActivityFetch {
  fetch: typeof fetch;
  pendingOperationCount$: Observable<number>;
}

export const monitorActivityFetch = (): MonitorActivityFetch => {
  const pendingOperationCountSubject = new BehaviorSubject<number>(0);
  const pendingOperationCount$ = pendingOperationCountSubject
    .asObservable()
    .pipe(debounceTime(100));
  return {
    fetch: (input, init) => {
      pendingOperationCountSubject.next(pendingOperationCountSubject.value + 1);
      const request = fetch(input, init);
      request
        .finally(() => {
          pendingOperationCountSubject.next(
            pendingOperationCountSubject.value - 1
          );
        })
        .catch((error) => {
          // Decrement count even on error
          pendingOperationCountSubject.next(
            pendingOperationCountSubject.value - 1
          );
          // Re-throw the error to maintain the original behavior
          throw error;
        });
      return request;
    },
    pendingOperationCount$,
  };
};
