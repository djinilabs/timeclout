import { queues } from "@architect/functions";
import { EventBusEvent } from "./types";
import { once } from "@/utils";

class EventBus {
  async emit(event: EventBusEvent) {
    console.log("emitting event", event);
    await queues.publish({
      name: "events",
      payload: event,
    });
  }
}

export const eventBus = once(() => new EventBus());
