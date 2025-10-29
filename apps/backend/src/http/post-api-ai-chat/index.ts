import { Writable } from "node:stream";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { boomify } from "@hapi/boom";
import { convertToModelMessages, streamText } from "ai";
import type { ToolSet, UIMessage } from "ai";
import { streamifyResponse, ResponseStream } from "lambda-stream";
import { z } from "zod";

import { enhanceResponseStream } from "./enhanceResponseStream";
import { HttpResponseStream } from "./HttpResponseStream";

import { getDefined } from "@/utils";

// The GEMINI_API_KEY should be set in environment variables
const google = createGoogleGenerativeAI({
  apiKey: getDefined(process.env.GEMINI_API_KEY, "GEMINI_API_KEY is not set"),
  headers: {
    Referer: "http://localhost:3000/api/ai/chat",
    "Content-Type": "text/event-stream",
  },
});

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

// Define tools that will be executed on the frontend
// These tools allow the AI to interact with the UI
// Tool execution happens on the frontend, but definitions are here so the AI knows about them
// When tools are called, they will be streamed to the frontend for execution
const tools: ToolSet = {
  describe_app_ui: {
    description:
      "Describes the current app UI. Use this to answer user queries and read the application state, like the list of companies, units or teams. You can also use this to read the item being displayed on the page.",
    inputSchema: z.object({}),
    execute: async () => {
      // This placeholder won't be used - tool calls are intercepted and executed on frontend
      return "Tool execution happens on frontend";
    },
  },
  click_element: {
    description:
      'Click on the first element that matches the role and the description (or label) for that element that you got from the describe_app_ui tool. Can be used to navigate the application state to answer user queries. The element needs the "clickable" attribute to be "true".',
    inputSchema: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
    }),
    execute: async () => {
      // This placeholder won't be used - tool calls are intercepted and executed on frontend
      return { success: false, error: "Tool execution happens on frontend" };
    },
  },
  fill_form_element: {
    description:
      "Fill in a form element (textarea, input, select, radio, checkbox) with a value. Use this to interact with form elements in the UI. The element needs to be found by its role and description.",
    inputSchema: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
      value: z.string(),
    }),
    execute: async () => {
      // This placeholder won't be used - tool calls are intercepted and executed on frontend
      return { success: false, error: "Tool execution happens on frontend" };
    },
  },
};

export interface ChatRequest {
  messages: UIMessage[];
}

const replyWithError = (responseStream: Writable, _error: Error) => {
  const err = boomify(_error);
  const httpResponseMetadata = err.output.payload;
  responseStream = HttpResponseStream.from(
    responseStream,
    httpResponseMetadata
  );
  responseStream.write(`3:${JSON.stringify(err.output.payload.message)}\n`);
  responseStream.end();
};

export const handler = streamifyResponse(
  async (event, responseStream: Writable) => {
    return new Promise<void>((resolve) => {
      const httpResponseMetadata = {
        statusCode: 200,
        statusMessage: "OK",
        headers: {},
      };

      responseStream = HttpResponseStream.from(
        responseStream,
        httpResponseMetadata
      );

      try {
        // Only handle POST requests
        if (event.requestContext.http.method !== "POST") {
          responseStream.write("event: error\ndata: Method not allowed\n\n");
          responseStream.end();
          return;
        }

        // get messages
        let messages: Array<UIMessage> = [];
        if (event.body) {
          const body = JSON.parse(
            event.isBase64Encoded
              ? Buffer.from(event.body, "base64").toString()
              : event.body
          );
          if (body.messages) {
            messages = body.messages;
          }
        }

        // Configure model
        const model = google(MODEL_NAME);

        console.log("model", model);

        console.log("messages", messages);

        // Prepare messages for conversion to ModelMessage format

        // Use AI SDK's convertToModelMessages to properly convert UIMessages to ModelMessages
        // const transformedMessages = convertToModelMessages(messages, {
        //   tools,
        // });

        // Log transformed messages for debugging
        console.log("[Backend] Transformed messages:");

        // Stream the AI response with tools
        // Type assertion needed because AI SDK types are complex and we're constructing messages correctly

        const result = streamText({
          model,
          messages,
          tools,
          toolChoice: "auto",
          onFinish: async ({ usage, finishReason, warnings }) => {
            console.log("Stream finished:", { usage, finishReason, warnings });
          },
        });

        const enhancedResponseStream = enhanceResponseStream(
          responseStream as ResponseStream,
          httpResponseMetadata
        );

        enhancedResponseStream.on("finish", () => {
          resolve();
        });

        // pipe result to response stream
        result.pipeUIMessageStreamToResponse(enhancedResponseStream);
      } catch (error) {
        console.error("Error in handler:", error);
        replyWithError(responseStream, error as Error);
      }
    });
  }
);
