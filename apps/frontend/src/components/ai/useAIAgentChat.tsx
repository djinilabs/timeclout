import { useChat } from "@ai-sdk/react";
import { useLingui } from "@lingui/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
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

  const tools = useAITools();

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      credentials: "include",
      fetch: async (input, init) => {
        const response = await fetch(input, init);

        // Clone the response so we can read it without consuming it
        const clonedResponse = response.clone();

        // Log the raw response stream for debugging
        if (clonedResponse.body) {
          const reader = clonedResponse.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          const readStream = async () => {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  if (buffer) {
                    console.log(
                      "[useAIAgentChat] Final stream buffer:",
                      buffer
                    );
                  }
                  break;
                }
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Log each chunk as it arrives
                console.log("[useAIAgentChat] Raw stream chunk:", chunk);

                // Try to parse complete lines
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                  if (line.trim()) {
                    console.log("[useAIAgentChat] Stream line:", line);
                    // Try to parse as JSON if it looks like JSON
                    if (line.startsWith("0:") || line.startsWith("data:")) {
                      const jsonPart = line.startsWith("0:")
                        ? line.slice(2)
                        : line.startsWith("data: ")
                        ? line.slice(6)
                        : line;
                      try {
                        const parsed = JSON.parse(jsonPart);
                        console.log(
                          "[useAIAgentChat] Parsed stream data:",
                          parsed
                        );
                      } catch {
                        console.log(
                          "[useAIAgentChat] Non-JSON stream data:",
                          jsonPart
                        );
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.error(
                "[useAIAgentChat] Error reading stream for logging:",
                error
              );
            }
          };

          // Read stream in background (don't await)
          readStream();
        }

        return response;
      },
    }),
    id: "timeclout-ai-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onError: (error) => {
      console.error("[useAIAgentChat] Chat error:", error);
    },
    onFinish: async ({ message, isError }) => {
      console.log("[useAIAgentChat] onFinish called", {
        message,
        isError,
        messageKeys: Object.keys(message),
        hasParts: "parts" in message,
        partsLength:
          "parts" in message && Array.isArray(message.parts)
            ? message.parts.length
            : 0,
        hasContent: "content" in message,
        contentValue: "content" in message ? message.content : undefined,
        fullMessage: JSON.stringify(message, null, 2),
      });

      // Save final message to history when streaming completes
      if (!isError && message) {
        // Try to get content from parts first, then fall back to content property
        let textContent = "";

        if (
          "parts" in message &&
          Array.isArray(message.parts) &&
          message.parts.length > 0
        ) {
          textContent = message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");
        } else if ("content" in message) {
          // Fallback to content property if parts is empty
          textContent =
            typeof message.content === "string" ? message.content : "";
        }

        console.log("[useAIAgentChat] Extracted textContent:", textContent);

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
    async onToolCall({ toolCall }) {
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
          chat.addToolOutput({
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
          chat.addToolOutput({
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
        chat.addToolOutput({
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
    return chat.messages.map((chatMsg) => {
      // Extract text content from message - try parts first, then content
      let content = "";

      if (
        "parts" in chatMsg &&
        Array.isArray(chatMsg.parts) &&
        chatMsg.parts.length > 0
      ) {
        const textParts = chatMsg.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text);
        content = textParts.join("");
      } else if ("content" in chatMsg) {
        content = typeof chatMsg.content === "string" ? chatMsg.content : "";
      }

      // Properly narrow the role type
      let role: "user" | "assistant" | "system";
      if (chatMsg.role === "user") {
        role = "user";
      } else if (chatMsg.role === "assistant") {
        role = "assistant";
      } else {
        role = "system";
      }

      return {
        id: chatMsg.id,
        timestamp: new Date(),
        isLoading:
          (chat.status === "streaming" || chat.status === "submitted") &&
          chatMsg.role === "assistant",
        message: {
          role,
          content: content || "",
        },
        content: content || "",
      };
    });
  }, [chat.messages, chat.status]);

  // Combine loaded history with current chat messages
  const allMessages: AIMessage[] = useMemo(() => {
    // Merge logic: prefer chat messages if they exist, otherwise use loaded history
    if (loading) {
      return chatMessages;
    }
    if (chatMessages.length > 0) {
      return chatMessages;
    }
    return loadedMessages;
  }, [loading, chatMessages, loadedMessages]);

  const handleUserMessageSubmit = useCallback(
    async (message: string) => {
      console.log(
        "[useAIAgentChat] handleUserMessageSubmit called with:",
        message
      );

      // Save user message to history
      const userMessage: AIMessage = {
        id:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].id
            : "",
        content: message,
        timestamp: new Date(),
        message: {
          role: "user",
          content: message,
        },
      };
      await saveNewMessage(userMessage);

      // Use useChat's sendMessage method (AI SDK v5 API)
      console.log("[useAIAgentChat] Sending message:", message);
      try {
        await chat.sendMessage({
          text: message,
        });
      } catch (error) {
        console.error("[useAIAgentChat] Error in chat.sendMessage:", error);
        throw error;
      }
    },
    [saveNewMessage, chat]
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
