import SchedulerWorker from "./schedulerWorker?worker";

import { SchedulerState, type SchedulerOptions } from "@/scheduler";

export class SchedulerWorkerClient {
  private worker: Worker | undefined;

  constructor() {}

  async start(
    options: SchedulerOptions,
    onProgress?: (progress: SchedulerState) => void
  ) {
    if (this.worker) {
      throw new Error("Worker already started");
    }
    this.worker = new SchedulerWorker({
      name: "SchedulerWorker",
    });
    this.worker.onerror = (event) => {
      console.error("SchedulerWorker error: ", event.error);
    };
    this.worker.onmessage = (event) => {
      onProgress?.(event.data);
    };
    console.log("SchedulerWorkerClient: sending options", options);
    this.worker.postMessage(options);
  }

  stop() {
    if (!this.worker) {
      return;
    }
    this.worker.terminate();
    this.worker = undefined;
  }
}
