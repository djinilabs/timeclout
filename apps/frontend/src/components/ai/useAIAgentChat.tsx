import { useChat } from "@ai-sdk/react";
import { useLingui } from "@lingui/react";
import { DefaultChatTransport } from "ai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef } from "react";

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
  const {
    messages: loadedMessages,
    saveNewMessage,
    clearMessages,
    loading,
  } = useAIChatHistory();

  const usedLanguageRef = useRef<string | undefined>(undefined);

  // Store tool results manually since addToolResult doesn't seem to work
  // Map: toolCallId -> { toolName, result }
  const toolResultsRef = useRef<
    Map<
      string,
      {
        toolName: string;
        result: unknown;
      }
    >
  >(new Map());

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

  const GREETING_MESSAGE = useMemo(
    () =>
      i18n.t(
        "Hello, I'm your TimeHaupt AI assistant. How can I help you today?"
      ),
    [i18n]
  );

  useEffect(() => {
    usedLanguageRef.current = i18n.locale;
  }, [i18n.locale]);

  const tools = useAITools();

  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "";

  // Use AI SDK's useChat hook for streaming chat functionality
  // Use DefaultChatTransport with custom API endpoint and body transformation
  // Note: We access toolResultsRef.current inside prepareSendMessagesRequest, which is called later,
  // not during render, so this is safe despite the linter warning
  const transport = useMemo(() => {
    // Capture the ref in the closure - we only access .current later when the function is called
    // This is safe because .current is only accessed inside prepareSendMessagesRequest callback
    const toolResultsMap = toolResultsRef;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new DefaultChatTransport({
      api: `${BACKEND_API_URL}/api/ai/chat`,
      prepareSendMessagesRequest: ({ messages }) => {
        console.log(
          "[prepareSendMessagesRequest] Received messages:",
          JSON.stringify(messages, null, 2)
        );
        // Transform UI messages to format expected by backend
        // Include system prompt, text content, tool calls, and tool results
        const transformedMessages: Array<{
          role: string;
          content?: string;
          toolCalls?: Array<{
            toolCallId: string;
            toolName: string;
            args: unknown;
          }>;
          toolResults?: Array<{
            toolCallId: string;
            toolName: string;
            result?: unknown;
            error?: string;
          }>;
        }> = [
          {
            role: "system",
            content: initialSystemPrompt,
          },
        ];

        for (const msg of messages) {
          const textParts = msg.parts.filter((part) => part.type === "text");
          // Tool calls can be "tool-call" or "tool-{toolName}" format
          const toolCallParts = msg.parts.filter(
            (part) =>
              part.type === "tool-call" ||
              (typeof part.type === "string" &&
                part.type.startsWith("tool-") &&
                part.type !== "tool-result")
          );
          const toolResultParts = msg.parts.filter(
            (part) => part.type === "tool-result"
          );

          console.log(
            `[prepareSendMessagesRequest] Message ${msg.role}:`,
            textParts.length,
            "text parts,",
            toolCallParts.length,
            "tool call parts,",
            toolResultParts.length,
            "tool result parts"
          );

          const textContent =
            textParts.length > 0
              ? textParts
                  .map((part) => (part as { text: string }).text || "")
                  .join("")
              : undefined;

          const transformedMsg: {
            role: string;
            content?: string;
            toolCalls?: Array<{
              toolCallId: string;
              toolName: string;
              args: unknown;
            }>;
            toolResults?: Array<{
              toolCallId: string;
              toolName: string;
              result?: unknown;
              error?: string;
            }>;
          } = {
            role: msg.role,
          };

          // Only process messages that have valid content
          // User and system messages must have content
          // Assistant messages need content, tool calls, or tool results
          const hasTextContent =
            textContent !== undefined && textContent.length > 0;
          const hasToolCalls = toolCallParts.length > 0;
          const hasToolResults = toolResultParts.length > 0;

          // Skip empty messages (user/system without content, assistant without content/toolCalls/toolResults)
          if (
            (msg.role === "user" || msg.role === "system") &&
            !hasTextContent
          ) {
            console.log(
              `[prepareSendMessagesRequest] Skipping ${msg.role} message without content`
            );
            continue;
          }

          if (
            msg.role === "assistant" &&
            !hasTextContent &&
            !hasToolCalls &&
            !hasToolResults
          ) {
            console.log(
              `[prepareSendMessagesRequest] Skipping assistant message without content, tool calls, or tool results`,
              "Message parts:",
              JSON.stringify(
                msg.parts.map((p) => ({
                  type: p.type,
                  ...(p.type !== "text" && p.type !== "step-start"
                    ? { data: p }
                    : {}),
                })),
                null,
                2
              )
            );
            continue;
          }

          // Assistant messages must have content (even if empty) for AI SDK validation
          if (msg.role === "assistant") {
            transformedMsg.content = hasTextContent ? textContent : "";
          } else if (hasTextContent) {
            transformedMsg.content = textContent;
          }

          if (toolCallParts.length > 0) {
            transformedMsg.toolCalls = toolCallParts.map((part) => {
              // Handle both "tool-call" and "tool-{toolName}" formats
              const toolCall = part as {
                toolCallId?: string;
                toolName?: string;
                args?: unknown;
                input?: unknown;
              };

              // If it's "tool-{toolName}" format, extract toolName from type
              let toolName = toolCall.toolName;
              if (
                !toolName &&
                typeof part.type === "string" &&
                part.type.startsWith("tool-")
              ) {
                toolName = part.type.replace(/^tool-/, "");
              }

              return {
                toolCallId: toolCall.toolCallId || "",
                toolName: toolName || "",
                args: toolCall.args ?? toolCall.input ?? {},
              };
            });
          }

          if (toolResultParts.length > 0) {
            transformedMsg.toolResults = toolResultParts.map((part) => {
              const toolResult = part as {
                toolCallId: string;
                toolName: string;
                result?: unknown;
                error?: string;
                output?: unknown;
                errorText?: string;
              };
              const result = toolResult.result ?? toolResult.output;
              console.log(
                `[prepareSendMessagesRequest] Tool result from message parts for ${toolResult.toolName}:`,
                typeof result,
                typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)
              );
              return {
                toolCallId: toolResult.toolCallId,
                toolName: toolResult.toolName,
                result: result,
                error: toolResult.error ?? toolResult.errorText,
              };
            });
          }

          // WORKAROUND: If this is an assistant message with tool calls but no tool results,
          // check if we have stored tool results for any of the tool calls
          if (
            msg.role === "assistant" &&
            toolCallParts.length > 0 &&
            toolResultParts.length === 0
          ) {
            const missingToolResults: Array<{
              toolCallId: string;
              toolName: string;
              result: unknown;
            }> = [];

            for (const toolCallPart of toolCallParts) {
              const toolCall = toolCallPart as { toolCallId?: string };
              if (toolCall.toolCallId) {
                const storedResult = toolResultsMap.current.get(
                  toolCall.toolCallId
                );
                if (storedResult) {
                  console.log(
                    `[prepareSendMessagesRequest] Found stored tool result for ${storedResult.toolName} (toolCallId: ${toolCall.toolCallId})`
                  );
                  missingToolResults.push({
                    toolCallId: toolCall.toolCallId,
                    toolName: storedResult.toolName,
                    result: storedResult.result,
                  });
                }
              }
            }

            if (missingToolResults.length > 0) {
              transformedMsg.toolResults = [
                ...(transformedMsg.toolResults || []),
                ...missingToolResults,
              ];
              console.log(
                `[prepareSendMessagesRequest] Added ${missingToolResults.length} stored tool results to assistant message`
              );
            }
          }

          transformedMessages.push(transformedMsg);
        }

        console.log(
          "[prepareSendMessagesRequest] Transformed messages:",
          JSON.stringify(transformedMessages, null, 2)
        );

        return {
          body: {
            messages: transformedMessages,
          },
        };
      },
    });
  }, [BACKEND_API_URL, initialSystemPrompt]);

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
          console.log(
            "[onToolCall] Executing tool:",
            toolCall.toolName,
            "with args:",
            JSON.stringify(args, null, 2)
          );
          const toolResult = await (
            tool.execute as (input: unknown) => Promise<unknown>
          )(args);

          console.log(
            "[onToolCall] Tool result:",
            typeof toolResult,
            typeof toolResult === "string"
              ? toolResult
              : JSON.stringify(toolResult, null, 2)
          );

          // Store tool result manually (workaround since addToolResult doesn't work reliably)
          console.log(
            "[onToolCall] Storing tool result manually for toolCallId:",
            toolCall.toolCallId
          );
          toolResultsRef.current.set(toolCall.toolCallId, {
            toolName: toolCall.toolName,
            result: toolResult,
          });

          // Try addToolResult first (should work with DefaultChatTransport)
          console.log("[onToolCall] Adding tool result with addToolResult...");
          try {
            chat.addToolResult({
              toolCallId: toolCall.toolCallId,
              tool: toolCall.toolName,
              output: toolResult,
            });
            console.log("[onToolCall] addToolResult called successfully");

            // Wait a moment to see if continuation happens automatically
            await new Promise((resolve) => setTimeout(resolve, 100));

            // If chat status is not streaming (meaning continuation didn't happen),
            // we need to manually trigger continuation
            if (chat.status !== "streaming") {
              console.log(
                "[onToolCall] Status is not streaming after addToolResult (status:",
                chat.status,
                "), manually triggering continuation..."
              );
              // Manually trigger continuation by reloading the conversation
              // The prepareSendMessagesRequest will be called with current messages including tool results
              // We use reloadMessages which should include tool results
              console.log(
                "[onToolCall] Triggering reload to continue with tool results..."
              );
              // Instead of sending empty message, we can try appending to trigger continuation
              // But first let's check if there's a reload or continue method
              // For now, we'll use a workaround: send a minimal continuation trigger
              // The backend will receive messages with tool results from prepareSendMessagesRequest
              await chat.sendMessage({ text: " " });
            } else {
              console.log(
                "[onToolCall] Continuation appears to be happening automatically, status:",
                chat.status
              );
            }
          } catch (addToolResultError) {
            console.error(
              "[onToolCall] Error calling addToolResult:",
              addToolResultError
            );
            // Fallback: manually append tool result and send continuation
            console.log("[onToolCall] Falling back to manual continuation...");
            await chat.sendMessage({ text: "" });
          }
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

  // Debug: Log message changes to track tool results and continuations
  useEffect(() => {
    console.log(
      "[useEffect] Chat messages changed:",
      JSON.stringify(
        chat.messages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts.map((p) => {
            const part: Record<string, unknown> = { type: p.type };
            if (p.type === "text") {
              part.text = (p as { text: string }).text;
            } else if (p.type === "tool-call") {
              const toolCall = p as { toolCallId?: string; toolName?: string };
              if (toolCall.toolCallId) part.toolCallId = toolCall.toolCallId;
              if (toolCall.toolName) part.toolName = toolCall.toolName;
            } else if (p.type === "tool-result") {
              const toolResult = p as {
                toolCallId?: string;
                toolName?: string;
                output?: unknown;
              };
              if (toolResult.toolCallId)
                part.toolCallId = toolResult.toolCallId;
              if (toolResult.toolName) part.toolName = toolResult.toolName;
              if (toolResult.output !== undefined)
                part.output = toolResult.output;
            }
            return part;
          }),
        })),
        null,
        2
      )
    );
    console.log("[useEffect] Chat status:", chat.status);
    chat.messages.forEach((msg, idx) => {
      const toolResults = msg.parts.filter((p) => p.type === "tool-result");
      const toolCalls = msg.parts.filter((p) => p.type === "tool-call");
      if (toolResults.length > 0 || toolCalls.length > 0) {
        console.log(
          `[useEffect] Message ${idx} (${msg.role}):`,
          toolCalls.length,
          "tool calls,",
          toolResults.length,
          "tool results"
        );
      }
    });
  }, [chat.messages, chat.status]);

  // Map chat messages to AIMessage format for compatibility with existing UI
  const chatMessages: AIMessage[] = useMemo(() => {
    return chat.messages.map((chatMsg) => {
      // Extract text content from UI message parts
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
      // The system prompt is included by the transport's prepareSendMessagesRequest
      await chat.sendMessage({
        text: message,
      });
    },
    [saveNewMessage, chat]
  );

  return {
    messages: allMessages,
    handleUserMessageSubmit,
    clearMessages: async () => {
      chat.setMessages([]);
      await clearMessages();
    },
  };
};
