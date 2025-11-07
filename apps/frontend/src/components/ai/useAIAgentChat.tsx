import { useChat } from "@ai-sdk/react";
import { useLingui } from "@lingui/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from "ai";
import { nanoid } from "nanoid";
import { useCallback, useMemo } from "react";

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

  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${BACKEND_API_URL}/api/ai/chat`,
        prepareSendMessagesRequest: ({ messages }) => {
          // Filter out any system messages - they should not be sent from client
          const nonSystemMessages = messages.filter(
            (msg: UIMessage) => msg.role !== "system"
          );
          // Get current language from i18n
          const language = i18n.locale || "en";
          return {
            body: {
              messages: nonSystemMessages,
            },
            headers: {
              "Accept-Language": language === "pt" ? "pt" : "en",
            },
          };
        },
      }),
    [BACKEND_API_URL, i18n.locale]
  );

  const chat = useChat({
    transport,
    id: "timeclout-ai-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: async ({ message, isError }) => {
      // Save final message to history when streaming completes
      if (!isError && message) {
        const textContent = message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");

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
      console.error("Chat error:", error);
      await handleError(error, nanoid());
    },
    async onToolCall({ toolCall }) {
      console.log("onToolCall", toolCall);
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
          // Add error as tool result
          chat.addToolResult({
            toolCallId: toolCall.toolCallId,
            tool: toolCall.toolName,
            state: "output-error",
            errorText: String(toolError),
          });
        }
      } else {
        console.error(
          "[onToolCall] Tool not found or has no execute:",
          toolName,
          tool
        );
      }
    },
  });

  const handleError = useCallback(
    async (error: Error, messageId = nanoid()) => {
      console.error("handleError", error);
      await saveNewMessage({
        id: messageId,
        message: {
          role: "assistant",
          content: "Error: " + error.message,
        },
        content: "Error: " + error.message,
        isError: true,
        timestamp: new Date(),
      });
    },
    [saveNewMessage]
  );

  // Map chat messages to AIMessage format for compatibility with existing UI
  const chatMessages: AIMessage[] = useMemo(() => {
    return chat.messages.map((chatMsg) => {
      // Extract text content from message parts
      const textParts = chatMsg.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text);
      const content = textParts.join("");

      return {
        id: chatMsg.id,
        timestamp: new Date(),
        isLoading: chat.status === "streaming" && chatMsg.role === "assistant",
        message: {
          role: (chatMsg.role === "user"
            ? "user"
            : chatMsg.role === "assistant"
            ? "assistant"
            : "system") as "user" | "assistant" | "system",
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
      await chat.sendMessage({
        text: message,
      });
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
