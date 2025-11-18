import { useChat } from "@ai-sdk/react";
import { useLingui } from "@lingui/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from "ai";
import { nanoid } from "nanoid";
import { useCallback, useMemo } from "react";

import { formatUserFriendlyError } from "../../utils/errorMessages";

import { AIMessage } from "./types";
import { useAIChatHistory } from "./useAIChatHistory";
import { useAITools } from "./useAITools";

export interface AIAgentChatResult {
  messages: AIMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useAIAgentChat = (): AIAgentChatResult => {
  const { i18n } = useLingui();

  const {
    messages: loadedMessages,
    saveNewMessage,
    clearMessages,
    loading,
  } = useAIChatHistory();

  const GREETING_MESSAGE = useMemo(
    () =>
      i18n.t(
        "Hello, I'm your TimeClout AI assistant. How can I help you today?"
      ),
    [i18n]
  );

  const tools = useAITools();

  const transport = useMemo(() => {
    const apiUrl = `${window.location.origin}/api/ai/chat`;
    const currentLocale = i18n.locale; // Capture current locale at transport creation time
    console.log(
      "[useAIAgentChat] Creating transport with API URL:",
      apiUrl,
      "locale:",
      currentLocale
    );
    return new DefaultChatTransport({
      api: apiUrl,
      prepareSendMessagesRequest: ({ messages }) => {
        // Filter out any system messages - they should not be sent from client
        const nonSystemMessages = messages.filter(
          (msg: UIMessage) => msg.role !== "system"
        );
        // Use the locale captured when transport was created
        const language = currentLocale || "en";
        console.log(
          "[useAIAgentChat] prepareSendMessagesRequest called with messages:",
          JSON.stringify(nonSystemMessages, null, 2)
        );
        return {
          body: {
            messages: nonSystemMessages,
          },
          headers: {
            "Accept-Language": language === "pt" ? "pt" : "en",
          },
        };
      },
      async fetch(url, options) {
        console.log("[useAIAgentChat] fetch called, making request to:", url);
        console.log("[useAIAgentChat] Request options:", {
          method: options?.method,
          headers: options?.headers,
          hasBody: !!options?.body,
        });

        let response: Response;
        try {
          // Add timeout to fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

          response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
        } catch (fetchError) {
          console.error("[useAIAgentChat] Fetch error:", fetchError);

          // Handle network errors, timeouts, and aborted requests
          if (fetchError instanceof Error) {
            if (fetchError.name === "AbortError") {
              throw new Error(i18n.t("Request timed out. Please try again."));
            }
            if (
              fetchError.message.includes("Failed to fetch") ||
              fetchError.message.includes("NetworkError") ||
              fetchError.message.includes("network")
            ) {
              throw new Error(
                i18n.t(
                  "Unable to connect to the server. Please check your internet connection and try again."
                )
              );
            }
          }
          throw fetchError;
        }

        // Check if response is JSON (non-streaming)
        const contentType = response.headers.get("content-type");
        console.log(
          "[useAIAgentChat] Response content-type:",
          contentType,
          "status:",
          response.status
        );

        // Handle HTTP error status codes
        if (!response.ok) {
          let errorMessage = i18n.t(
            "An error occurred while processing your request."
          );

          try {
            const errorData = await response.json();
            if (errorData.error || errorData.message) {
              errorMessage = errorData.error || errorData.message;
            }
          } catch {
            // If JSON parsing fails, try to get text
            try {
              const errorText = await response.text();
              if (errorText) {
                errorMessage = errorText;
              }
            } catch {
              // Use default error message based on status code
              if (response.status === 401) {
                errorMessage = i18n.t(
                  "Authentication required. Please log in again."
                );
              } else if (response.status === 403) {
                errorMessage = i18n.t(
                  "You don't have permission to perform this action."
                );
              } else if (response.status === 404) {
                errorMessage = i18n.t("The requested resource was not found.");
              } else if (response.status === 429) {
                errorMessage = i18n.t(
                  "Too many requests. Please wait a moment and try again."
                );
              } else if (response.status >= 500) {
                errorMessage = i18n.t("Server error. Please try again later.");
              } else {
                errorMessage = i18n.t("Request failed with status {status}.", {
                  status: response.status,
                });
              }
            }
          }

          throw new Error(errorMessage);
        }

        if (contentType?.includes("application/json")) {
          console.log("[useAIAgentChat] Detected JSON response, parsing...");
          // Parse the JSON response
          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            console.error("[useAIAgentChat] JSON parse error:", parseError);
            throw new Error(
              i18n.t("Invalid response from server. Please try again.")
            );
          }
          console.log(
            "[useAIAgentChat] Parsed JSON data:",
            JSON.stringify(data, null, 2)
          );

          // Convert OpenAI-compatible JSON response to streaming format
          // DefaultChatTransport expects a ReadableStream with specific format
          if (data.choices && data.choices[0]?.message) {
            const message = data.choices[0].message;
            console.log(
              "[useAIAgentChat] Message from backend:",
              JSON.stringify(message, null, 2)
            );
            const textEncoder = new TextEncoder();
            const streamChunks: string[] = [];

            // Create a stream that mimics the streaming format
            // Use async start to ensure proper timing and allow the reader to start
            const stream = new ReadableStream({
              async start(controller) {
                try {
                  // Send text content if present
                  if (message.content) {
                    // Format: 0:"text content"\n
                    const escapedContent = message.content
                      .replace(/\\/g, "\\\\")
                      .replace(/"/g, '\\"')
                      .replace(/\n/g, "\\n")
                      .replace(/\r/g, "\\r");
                    const textChunk = `0:"${escapedContent}"\n`;
                    streamChunks.push(textChunk);
                    controller.enqueue(textEncoder.encode(textChunk));
                    console.log(
                      "[useAIAgentChat] Enqueued text chunk:",
                      textChunk
                    );
                    // Allow time for chunk to be processed
                    await new Promise((resolve) => setTimeout(resolve, 10));
                  }

                  // Send tool calls if present
                  if (message.tool_calls && message.tool_calls.length > 0) {
                    console.log(
                      "[useAIAgentChat] Processing",
                      message.tool_calls.length,
                      "tool calls"
                    );
                    for (const toolCall of message.tool_calls) {
                      try {
                        const parsedArgs = JSON.parse(
                          toolCall.function.arguments
                        );
                        // Format: 2:{"toolCallId":"...","toolName":"...","args":{...}}\n
                        const toolCallData = {
                          toolCallId: toolCall.id,
                          toolName: toolCall.function.name,
                          args: parsedArgs,
                        };
                        const toolCallChunk = `2:${JSON.stringify(
                          toolCallData
                        )}\n`;
                        streamChunks.push(toolCallChunk);
                        controller.enqueue(textEncoder.encode(toolCallChunk));
                        console.log(
                          "[useAIAgentChat] Enqueued tool call chunk:",
                          toolCallChunk
                        );
                        // Allow time between chunks
                        await new Promise((resolve) => setTimeout(resolve, 10));
                      } catch (parseError) {
                        console.error(
                          "[useAIAgentChat] Error parsing tool call arguments:",
                          parseError,
                          "toolCall:",
                          toolCall
                        );
                      }
                    }
                  }

                  // Send done signal after a small delay
                  await new Promise((resolve) => setTimeout(resolve, 10));
                  const doneChunk = "d\n";
                  streamChunks.push(doneChunk);
                  controller.enqueue(textEncoder.encode(doneChunk));
                  controller.close();
                  console.log(
                    "[useAIAgentChat] Stream complete. All chunks:",
                    streamChunks
                  );
                } catch (error) {
                  console.error("[useAIAgentChat] Stream error:", error);
                  controller.error(error);
                }
              },
            });

            // Return a new Response with the stream and proper headers
            // Note: DefaultChatTransport expects text/plain or text/event-stream
            const streamResponse = new Response(stream, {
              status: response.status,
              statusText: response.statusText,
              headers: {
                "content-type": "text/plain; charset=utf-8",
                "cache-control": "no-cache",
                connection: "keep-alive",
              },
            });

            // Log what we're returning for debugging
            console.log(
              "[useAIAgentChat] Returning stream response with chunks:",
              streamChunks
            );

            return streamResponse;
          } else {
            console.warn(
              "[useAIAgentChat] No choices or message in response:",
              data
            );
            // If response doesn't have expected structure, throw error
            throw new Error(
              i18n.t("Invalid response format from server. Please try again.")
            );
          }
        }

        // If not JSON, check if it's a streaming response
        // For streaming responses, we should still check for errors
        if (!response.ok) {
          // For streaming responses with errors, we need to handle them differently
          // The error will be caught by the onError handler
          throw new Error(
            i18n.t("Error receiving response from server. Please try again.")
          );
        }

        // If not JSON, return the response as-is (for streaming responses)
        console.log("[useAIAgentChat] Returning response as-is (not JSON)");
        return response;
      },
    });
  }, [i18n]);

  const handleError = useCallback(
    async (error: Error, messageId = nanoid()) => {
      console.error("[useAIAgentChat] handleError", error);

      // Format error to be user-friendly
      const friendlyError = formatUserFriendlyError(error);

      // Create error message with title and description
      const errorContent = friendlyError.title
        ? `${friendlyError.title}\n\n${friendlyError.message}`
        : friendlyError.message;

      await saveNewMessage({
        id: messageId,
        message: {
          role: "assistant",
          content: errorContent,
        },
        content: errorContent,
        isError: true,
        timestamp: new Date(),
      });
    },
    [saveNewMessage]
  );

  const chat = useChat({
    transport,
    id: "timeclout-ai-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: async ({ message, isError }) => {
      console.log(
        "[useAIAgentChat] onFinish called",
        JSON.stringify(
          {
            message: message
              ? {
                  id: message.id,
                  role: message.role,
                  parts: message.parts,
                  partsDetail: message.parts.map((part) => {
                    if (part.type === "text") {
                      return { type: part.type, text: part.text };
                    }
                    if (part.type.startsWith("tool-") && "toolCallId" in part) {
                      return {
                        type: part.type,
                        toolCallId: part.toolCallId,
                        state: "state" in part ? part.state : undefined,
                      };
                    }
                    return { type: part.type };
                  }),
                }
              : null,
            isError,
          },
          null,
          2
        )
      );
      // Save final message to history when streaming completes
      if (!isError && message) {
        const textContent = message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");

        const toolCallParts = message.parts.filter((part) =>
          part.type.startsWith("tool-")
        );

        console.log(
          "[useAIAgentChat] Saving message:",
          JSON.stringify(
            {
              id: message.id,
              textContent,
              role: message.role,
              hasToolCalls: toolCallParts.length > 0,
              toolCallsCount: toolCallParts.length,
              toolCallParts: toolCallParts.map((part) => ({
                type: part.type,
                toolCallId: "toolCallId" in part ? part.toolCallId : undefined,
                state: "state" in part ? part.state : undefined,
              })),
            },
            null,
            2
          )
        );

        // If there are tool calls but onToolCall wasn't called, log it
        if (toolCallParts.length > 0) {
          console.log(
            "[useAIAgentChat] Message has tool calls but onToolCall wasn't triggered:",
            JSON.stringify(
              toolCallParts.map((part) => ({
                type: part.type,
                toolCallId: "toolCallId" in part ? part.toolCallId : undefined,
                state: "state" in part ? part.state : undefined,
              })),
              null,
              2
            )
          );
        }

        await saveNewMessage({
          id: message.id,
          timestamp: new Date(),
          content: textContent,
          isLoading: false,
          message: {
            role:
              message.role === "user"
                ? "user"
                : message.role === "assistant"
                ? "assistant"
                : "system",
            content: textContent,
          },
        });
      }
    },
    onError: async (error) => {
      console.error(
        "[useAIAgentChat] Chat error:",
        JSON.stringify(
          {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          null,
          2
        )
      );

      // Format error message to be user-friendly
      const friendlyError = formatUserFriendlyError(error);
      const errorMessage = `${friendlyError.title}: ${friendlyError.message}`;

      // Create a new error with the friendly message
      const userFriendlyError = new Error(errorMessage);
      userFriendlyError.name = error.name;
      userFriendlyError.stack = error.stack;

      await handleError(userFriendlyError, nanoid());
    },
    async onToolCall({ toolCall }) {
      console.log(
        "[useAIAgentChat] onToolCall",
        JSON.stringify(
          {
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            args: "args" in toolCall ? toolCall.args : toolCall.input,
          },
          null,
          2
        )
      );
      // Execute tools on frontend (since tools need DOM access)
      const toolName = toolCall.toolName as keyof typeof tools;
      const tool = tools[toolName];
      if (tool && tool.execute) {
        try {
          const args = "args" in toolCall ? toolCall.args : toolCall.input;
          const toolResult = await (
            tool.execute as (input: unknown) => Promise<unknown>
          )(args);

          // Add tool result using AI SDK's built-in method
          chat.addToolResult({
            toolCallId: toolCall.toolCallId,
            tool: toolCall.toolName,
            output: toolResult,
          });
        } catch (toolError) {
          console.error("[onToolCall] Tool error:", toolError);

          // Format error message to be user-friendly
          const errorMessage =
            toolError instanceof Error ? toolError.message : String(toolError);

          const friendlyError = formatUserFriendlyError(
            toolError instanceof Error ? toolError : new Error(errorMessage)
          );

          // Add error as tool result with user-friendly message
          chat.addToolResult({
            toolCallId: toolCall.toolCallId,
            tool: toolCall.toolName,
            state: "output-error",
            errorText: `${friendlyError.title}: ${friendlyError.message}`,
          });
        }
      } else {
        console.error(
          "[onToolCall] Tool not found or has no execute:",
          toolName,
          tool
        );

        // Add error result for missing tool
        chat.addToolResult({
          toolCallId: toolCall.toolCallId,
          tool: toolCall.toolName,
          state: "output-error",
          errorText: i18n.t(
            "Tool '{toolName}' is not available. Please try a different approach.",
            { toolName: toolCall.toolName }
          ),
        });
      }
    },
  });

  // Map chat messages to AIMessage format for compatibility with existing UI
  const chatMessages: AIMessage[] = useMemo(() => {
    console.log(
      "[useAIAgentChat] chat.messages:",
      JSON.stringify(
        chat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          parts: msg.parts,
        })),
        null,
        2
      )
    );
    console.log(
      "[useAIAgentChat] chat.status:",
      JSON.stringify(
        {
          status: chat.status,
          error: chat.error,
        },
        null,
        2
      )
    );
    return chat.messages.map((chatMsg) => {
      // Extract text content from message parts
      const textParts = chatMsg.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text);
      const content = textParts.join("");

      // Properly narrow the role type - chatMsg.role is already typed from useChat
      // CoreMessage role can be "user" | "assistant" | "system" | "tool"
      // We map it to our AIMessage format which expects "user" | "assistant" | "system"
      let role: "user" | "assistant" | "system";
      if (chatMsg.role === "user") {
        role = "user";
      } else if (chatMsg.role === "assistant") {
        role = "assistant";
      } else {
        // For "system" or "tool" roles, default to "system"
        role = "system";
      }

      return {
        id: chatMsg.id,
        timestamp: new Date(),
        isLoading: chat.status === "streaming" && chatMsg.role === "assistant",
        message: {
          role,
          content: content || "",
        },
        content: content || "",
      };
    });
  }, [chat.messages, chat.status, chat.error]);

  // Combine loaded history with current chat messages
  const allMessages: AIMessage[] = useMemo(() => {
    // Merge logic: prefer chat messages if they exist, otherwise use loaded history
    if (loading) {
      return chatMessages;
    }
    if (chatMessages.length > 0) {
      return chatMessages;
    }
    if (loadedMessages.length === 0) {
      return [
        {
          id: nanoid(),
          timestamp: new Date(),
          message: {
            role: "assistant" as const,
            content: GREETING_MESSAGE,
          },
          content: GREETING_MESSAGE,
        },
        ...loadedMessages,
      ];
    }
    return loadedMessages;
  }, [loading, chatMessages, loadedMessages, GREETING_MESSAGE]);

  const handleUserMessageSubmit = useCallback(
    async (message: string) => {
      console.log(
        "[useAIAgentChat] handleUserMessageSubmit called with:",
        message
      );
      console.log("[useAIAgentChat] chat object:", {
        status: chat.status,
        error: chat.error,
      });

      // Save user message to history
      const userMessage: AIMessage = {
        id: nanoid(),
        content: message,
        timestamp: new Date(),
        message: {
          role: "user",
          content: message,
        },
      };
      await saveNewMessage(userMessage);

      // Use useChat's sendMessage which handles streaming automatically
      // The system prompt is included via the transport's body configuration
      console.log("[useAIAgentChat] Calling chat.sendMessage...");
      try {
        await chat.sendMessage({
          text: message,
        });
        console.log("[useAIAgentChat] chat.sendMessage completed");
      } catch (error) {
        console.error("[useAIAgentChat] Error in chat.sendMessage:", error);
        // The error will be handled by onError callback, but we should also
        // handle it here to provide immediate feedback
        if (error instanceof Error) {
          await handleError(error, nanoid());
        } else {
          await handleError(
            new Error(
              i18n.t("An unexpected error occurred. Please try again.")
            ),
            nanoid()
          );
        }
        // Re-throw to allow caller to handle if needed
        throw error;
      }
    },
    [saveNewMessage, chat, handleError, i18n]
  );

  // Filter out system messages before returning - they shouldn't be displayed in the UI
  const visibleMessages = useMemo(
    () => allMessages.filter((msg) => msg.message.role !== "system"),
    [allMessages]
  );

  return {
    messages: visibleMessages,
    handleUserMessageSubmit,
    clearMessages: async () => {
      chat.setMessages([]);
      await clearMessages();
    },
  };
};
