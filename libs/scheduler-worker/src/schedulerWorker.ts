// scheduler worker

import { i18n, initI18n } from "@/locales";
import { Scheduler } from "@/scheduler";

let scheduler: Scheduler | undefined;

console.log("SchedulerWorker: starting");

i18n.loadAndActivate({
  locale: "en",
  messages: {},
});

self.onmessage = (event) => {
  console.log("SchedulerWorker: onmessage", event.data);

  // Initialize i18n with the locale from options, fallback to "en"
  const locale = event.data.locale || "en";
  initI18n(locale);

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
