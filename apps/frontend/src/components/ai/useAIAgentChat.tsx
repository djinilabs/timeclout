import { useChat } from "@ai-sdk/react";
import { useLingui } from "@lingui/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
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
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      credentials: "include",
    }),
    id: "timeclout-ai-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: async ({ message, isError }) => {
      console.log("[useAIAgentChat] onFinish called", { message, isError });
      // Save final message to history when streaming completes
      if (!isError && message) {
        const textContent = message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");

        const toolCallParts = message.parts.filter((part) =>
          part.type.startsWith("tool-")
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

  console.log("[useAIAgentChat] chat:", chat);

  // Map chat messages to AIMessage format for compatibility with existing UI
  const chatMessages: AIMessage[] = useMemo(() => {
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
      console.log("[useAIAgentChat] Sending message:", message);
      try {
        await chat.sendMessage({
          text: message,
        });
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
