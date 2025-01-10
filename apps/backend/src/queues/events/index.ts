import { Context, SQSBatchResponse, SQSEvent } from "aws-lambda";
import { handleQueueEvent } from "../handleQueueEvent";
import { EventBusEvent } from "@/event-bus";
import { handleCreateLeaveRequest } from "./createLeaveRequest";

export const handler = async (
  event: SQSEvent,
  context: Context
): Promise<SQSBatchResponse> => {
  return handleQueueEvent<EventBusEvent>(
    event,
    async (payload: EventBusEvent) => {
      switch (payload.key) {
        case "createLeaveRequest":
          await handleCreateLeaveRequest(payload);
          break;
      }
    }
  );
};
