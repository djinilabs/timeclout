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
            .catch((err) => {
              console.error("Error processing event", err);
              reject(err);
            });
        } catch (error) {
          console.error("Error processing event", error);
          reject(error);
        }
      });
    }) ?? []
  );
  return {
    batchItemFailures: results
      .flatMap((result, resultIndex) =>
        result.status === "rejected"
          ? [event.Records[resultIndex].messageId]
          : []
      )
      .map((messageId) => ({
        itemIdentifier: messageId,
      })),
  };
};
