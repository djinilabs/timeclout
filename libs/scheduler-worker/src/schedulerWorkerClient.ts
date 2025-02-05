import { type SchedulerOptions } from "@/scheduler";

export class SchedulerWorkerClient {
  private worker: Worker | undefined;
  constructor() {}

  async start(options: SchedulerOptions) {
    if (this.worker) {
      throw new Error("Worker already started");
    }
    this.worker = new Worker(new URL("./schedulerWorker.js", import.meta.url));
    this.worker.onmessage = (event) => {
      console.log(event);
    };
    this.worker.postMessage(options);
  }

  stop() {
    if (!this.worker) {
      throw new Error("Worker not started");
    }
    this.worker.terminate();
    this.worker = undefined;
  }
}
