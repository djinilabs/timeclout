import { SQSBatchResponse, SQSEvent } from "aws-lambda";

import { handlingQueueErrors } from "../../utils/handlingQueueErrors";
import { handleQueueEvent } from "../handleQueueEvent";

import { handleCreateOrUpdateLeaveRequest } from "./createOrUpdateLeaveRequest";
import { handleRejectLeaveRequest } from "./rejectLeaveRequest";

import { EventBusEvent } from "@/event-bus";

const handlerImpl = async (event: SQSEvent): Promise<SQSBatchResponse> =>
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

export const handler = handlingQueueErrors(handlerImpl);
