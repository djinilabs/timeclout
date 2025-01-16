import { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { handleQueueEvent } from "../handleQueueEvent";
import { EventBusEvent } from "@/event-bus";
import { handleCreateOrUpdateLeaveRequest } from "./createOrUpdateLeaveRequest";
import { handleRejectLeaveRequest } from "./rejectLeaveRequest";

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> =>
  handleQueueEvent<EventBusEvent>(event, async (payload: EventBusEvent) => {
    switch (payload.key) {
      case "createOrUpdateLeaveRequest":
        await handleCreateOrUpdateLeaveRequest(payload);
        break;
      case "rejectLeaveRequest":
        await handleRejectLeaveRequest(payload);
        break;
    }
  });
