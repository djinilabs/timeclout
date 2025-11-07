import { Writable } from "node:stream";

const isAWSLambda = typeof awslambda !== "undefined";

export const HttpResponseStream = {
  from(stream: Writable, metadata: Record<string, unknown>) {
    if (isAWSLambda) {
      return awslambda.HttpResponseStream.from(
        stream as Writable,
        metadata as Record<string, unknown>
      );
    }
    return stream;
  },
};
