import { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { handleQueueEvent } from "../handleQueueEvent";
import { EventBusEvent } from "@/event-bus";
import { handleCreateOrUpdateLeaveRequest } from "./createOrUpdateLeaveRequest";

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  return handleQueueEvent<EventBusEvent>(
    event,
    async (payload: EventBusEvent) => {
      switch (payload.key) {
        case "createOrUpdateLeaveRequest":
          await handleCreateOrUpdateLeaveRequest(payload);
          break;
        default:
          throw new Error(`Unknown event key: ${payload.key}`);
      }
    }
  );
};
