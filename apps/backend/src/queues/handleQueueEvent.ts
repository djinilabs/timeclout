import { SQSBatchResponse, SQSEvent } from "aws-lambda";

export type QueueEventHandler<T extends object> = (payload: T) => Promise<void>;

export const handleQueueEvent = async <T extends object>(
  event: SQSEvent,
  handler: QueueEventHandler<T>
): Promise<SQSBatchResponse> => {
  const results = await Promise.allSettled(
    event.Records?.map((record) => {
      return new Promise((resolve, reject) => {
        const payload = JSON.parse(record.body);
        try {
          handler(payload)
            .then((result) => resolve(result))
            .catch(reject);
        } catch (error) {
          console.error("Error processing event", error);
          reject(error);
        }
      });
    }) ?? []
  );
  return {
    batchItemFailures: results
      .map((result, resultIndex) => ({
        itemIdentifier:
          result.status === "rejected"
            ? event.Records[resultIndex].messageId
            : undefined,
      }))
      .filter((result) => result.itemIdentifier !== undefined),
  };
};
