import { useChat } from "@ai-sdk/react";
import { useLingui } from "@lingui/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { nanoid } from "nanoid";
import { useCallback, useMemo } from "react";

import { AIMessage } from "./types";
import { useAIChatHistory } from "./useAIChatHistory";
import { useAITools } from "./useAITools";
import { useTestToolExecutionFromConsole } from "./useTestToolExecutionFromConsole";

export interface AIAgentChatResult {
  messages: AIMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useAIAgentChat = (): AIAgentChatResult => {
  const { i18n } = useLingui();
  const initialSystemPrompt = useMemo(
    () =>
      i18n.t(`You are a helpful assistant that lives inside the TimeHaupt product (an application to help with team scheduling shifts).
  You can interact with the TimeHaupt product like if you were a user of the application. You can look at the UI using the describe_app_ui tool.
  You can click and on elements or open them using the click_element tool and then looking again to the UI to see the changes.
  You can fill text fields using the fill_form_element tool.
  You should use the tools provided to you to answer questions and help with tasks.
  Don't plan, just act.
  If the user asks you to do something, you should try to use the provided tools.
  After you have received a tool-result, reply to the user in __plain english__ with your findings.
  If a tool result is an error, you should try to use the tools again.
  If the tool does not get you the data you need, try navigating to another page.
  If that does not work, just say you don't have enough data.
  `),
    [i18n]
  );

  const {
    messages: loadedMessages,
    saveNewMessage,
    clearMessages,
    loading,
  } = useAIChatHistory(initialSystemPrompt);

  const GREETING_MESSAGE = useMemo(
    () =>
      i18n.t(
        "Hello, I'm your TimeHaupt AI assistant. How can I help you today?"
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
          // Always prepend the system message to ensure it's included in every request
          // Filter out any existing system messages first to avoid duplicates
          const nonSystemMessages = messages.filter(
            (msg: UIMessage) => msg.role !== "system"
          );
          // Create system message in the format expected by the backend
          const systemMessage: UIMessage = {
            role: "system" as const,
            id: nanoid(),
            parts: [{ type: "text", text: initialSystemPrompt }],
          };
          return {
            body: {
              messages: [systemMessage, ...nonSystemMessages],
            },
          };
        },
      }),
    [BACKEND_API_URL, initialSystemPrompt]
  );

  const chat = useChat({
    transport,
    id: "timehaupt-ai-chat",
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

  useTestToolExecutionFromConsole(tools);

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
