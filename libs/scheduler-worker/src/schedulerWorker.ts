// scheduler worker

import { Scheduler } from "@/scheduler";

let scheduler: Scheduler | undefined;

onmessage = (event) => {
  scheduler = new Scheduler(event.data);
  scheduler.subscribe(
    (state) => {
      postMessage(state);
    },
    {
      interval: 1000,
    }
  );
  scheduler.start();
};

onerror = (event) => {
  console.error(event);
};
