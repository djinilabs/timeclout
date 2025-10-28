import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";

import { getDefined } from "@/utils";

console.log("process.env.GEMINI_API_KEY", process.env.GEMINI_API_KEY);

// The GEMINI_API_KEY should be set in environment variables
const google = createGoogleGenerativeAI({
  apiKey: getDefined(process.env.GEMINI_API_KEY, "GEMINI_API_KEY is not set"),
});

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export const handler = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : { messages: [] };

    const { messages } = body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Invalid request body" }),
      };
    }

    // Configure model
    const model = google(MODEL_NAME);

    // Stream the AI response
    const result = await streamText({
      model,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      onFinish: async ({ usage, finishReason, warnings }) => {
        console.log("Stream finished:", { usage, finishReason, warnings });
      },
    });

    // For streaming, we need to use Lambda's response streaming capability
    // Since this is a regular Lambda (not a streaming function URL),
    // we'll accumulate the stream and return it
    let fullResponse = "";

    for await (const chunk of result.textStream) {
      fullResponse += chunk;
    }

    // Return the accumulated response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: fullResponse,
        usage: await result.usage,
        finishReason: await result.finishReason,
      }),
    };
  }
);
