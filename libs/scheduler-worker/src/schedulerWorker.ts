// scheduler worker

import { Scheduler } from "@/scheduler";

let scheduler: Scheduler | undefined;

console.log("SchedulerWorker: starting");

self.onmessage = (event) => {
  console.log("SchedulerWorker: onmessage", event.data);
  scheduler = new Scheduler(event.data);
  scheduler.subscribe(
    (state) => {
      self.postMessage(state);
    },
    {
      interval: 1000,
    }
  );
  scheduler.start();
};

self.onerror = (event) => {
  console.error(event);
};
