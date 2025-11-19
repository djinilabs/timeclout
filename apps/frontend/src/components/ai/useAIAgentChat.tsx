import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";

import { findFirstElementInAOM } from "../../accessibility/findFirstElement";
import { generateAccessibilityObjectModel } from "../../accessibility/generateAOM";
import { printAOM } from "../../accessibility/printAOM";
import { useLocale } from "../../hooks/useLocale";
import { getDocSearchManager } from "../../utils/docSearchManager";

import { type AIMessage } from "./types";
import { useAIChatHistory } from "./useAIChatHistory";

// Greeting messages
const GREETING_EN =
  "Hello, I'm your TimeClout AI assistant. How can I help you today?";
const GREETING_PT =
  "Olá, sou o seu assistente de IA do TimeClout. Como posso ajudá-lo hoje?";

// API URL for backend
const API_URL = "/api/ai/chat";
const EMBEDDING_API_URL = "/api/ai/embedding";

// Activity debouncing delay
const ACTIVITY_DEBOUNCE_MS = 500;

/**
 * Wait for activity to settle (debounce fetch activity)
 */
const waitForActivityToSettle = (): Promise<void> => {
  return new Promise((resolve) => {
    let lastActivityTime = Date.now();
    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityTime >= ACTIVITY_DEBOUNCE_MS) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Monitor fetch activity
    const originalFetch = window.fetch;
    let fetchCount = 0;
    window.fetch = (...args) => {
      lastActivityTime = Date.now();
      fetchCount++;
      const result = originalFetch(...args);
      result.finally(() => {
        fetchCount--;
        if (fetchCount === 0) {
          lastActivityTime = Date.now();
        }
      });
      return result;
    };

    // Restore after timeout
    setTimeout(() => {
      window.fetch = originalFetch;
      clearInterval(checkInterval);
      resolve();
    }, ACTIVITY_DEBOUNCE_MS * 2);
  });
};

/**
 * Tool execution functions
 */
const executeDescribeAppUI = async (): Promise<string> => {
  const aom = generateAccessibilityObjectModel(document, false);
  return printAOM(aom);
};

const executeClickElement = async (
  role: string,
  description: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const aom = generateAccessibilityObjectModel(document, true);
    const element = findFirstElementInAOM(aom, role, description);

    if (!element) {
      return {
        success: false,
        error: `Element with role "${role}" and description "${description}" not found`,
      };
    }

    if (!element.domElement) {
      return { success: false, error: "Element DOM reference not available" };
    }

    // Check if element is clickable
    const clickableRoles = new Set([
      "button",
      "link",
      "checkbox",
      "radio",
      "combobox",
    ]);
    const isClickable =
      clickableRoles.has(element.role) ||
      element.domElement.getAttribute("role") === "button" ||
      element.domElement.tagName === "BUTTON" ||
      element.domElement.tagName === "A";

    if (!isClickable) {
      return {
        success: false,
        error: `Element with role "${role}" is not clickable`,
      };
    }

    // Simulate click
    (element.domElement as HTMLElement).click();

    // Wait for UI to update
    await waitForActivityToSettle();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const executeFillFormElement = async (
  role: string,
  description: string,
  value: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const aom = generateAccessibilityObjectModel(document, true);
    const element = findFirstElementInAOM(aom, role, description);

    if (!element) {
      return {
        success: false,
        error: `Element with role "${role}" and description "${description}" not found`,
      };
    }

    if (!element.domElement) {
      return { success: false, error: "Element DOM reference not available" };
    }

    const domElement = element.domElement as HTMLElement;

    // Focus the element
    domElement.focus();

    // Fill based on element type
    if (role === "combobox" || domElement.tagName === "SELECT") {
      // For combobox/select, open dropdown first if needed
      if (domElement.tagName === "SELECT") {
        (domElement as HTMLSelectElement).value = value;
        domElement.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        // For custom combobox, try to set value
        (domElement as HTMLInputElement).value = value;
        domElement.dispatchEvent(new Event("input", { bubbles: true }));
        domElement.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else if (role === "checkbox") {
      const checkbox = domElement as HTMLInputElement;
      const boolValue = value.toLowerCase() === "true" || value === "1";
      checkbox.checked = boolValue;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (role === "radio") {
      const radio = domElement as HTMLInputElement;
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (
      domElement.tagName === "TEXTAREA" ||
      domElement.tagName === "INPUT"
    ) {
      const input = domElement as HTMLInputElement | HTMLTextAreaElement;
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      // Try generic approach
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (domElement as any).value = value;
      domElement.dispatchEvent(new Event("input", { bubbles: true }));
      domElement.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // Wait for UI to update
    await waitForActivityToSettle();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const executeSearchDocuments = async (
  query: string,
  topN: number = 5
): Promise<{
  results: Array<{ snippet: string; documentName: string; similarity: number }>;
}> => {
  try {
    const manager = getDocSearchManager(EMBEDDING_API_URL);
    const searchResults = await manager.searchDocuments(query, topN);
    return {
      results: searchResults.map((r) => ({
        snippet: r.snippet,
        documentName: r.documentName,
        similarity: r.similarity,
      })),
    };
  } catch {
    return {
      results: [],
    };
  }
};

export interface AIAgentChatResult {
  messages: AIMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string | unknown[];
}

interface ChatResponse {
  text: string;
  toolCalls?: Array<{
    toolCallId: string;
    toolName: string;
    args: unknown;
  }>;
  toolResults?: unknown[];
  finishReason?: string;
}

export const useAIAgentChat = (): AIAgentChatResult => {
  const { locale } = useLocale();
  const {
    messages: historyMessages,
    saveNewMessage,
    clearMessages: clearHistory,
  } = useAIChatHistory();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from history on mount
  useEffect(() => {
    if (historyMessages.length > 0 && messages.length === 0) {
      setMessages(historyMessages);
    }
  }, [historyMessages, messages.length]);

  // Execute tool and get result
  const executeTool = useCallback(
    async (toolCall: {
      toolCallId: string;
      toolName: string;
      args: unknown;
    }): Promise<unknown> => {
      const { toolName, args } = toolCall;
      const argsObj = args as Record<string, unknown>;

      try {
        switch (toolName) {
          case "describe_app_ui":
            return await executeDescribeAppUI();
          case "click_element":
            return await executeClickElement(
              argsObj.role as string,
              argsObj.description as string
            );
          case "fill_form_element":
            return await executeFillFormElement(
              argsObj.role as string,
              argsObj.description as string,
              argsObj.value as string
            );
          case "search_documents":
            return await executeSearchDocuments(
              argsObj.query as string,
              (argsObj.topN as number) || 5
            );
          default:
            return { error: `Unknown tool: ${toolName}` };
        }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    []
  );

  // Send message to backend and handle response
  const sendMessage = useCallback(
    async (chatMessages: ChatMessage[]): Promise<ChatResponse> => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        credentials: "include",
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${errorText}`);
      }

      return (await response.json()) as ChatResponse;
    },
    [locale]
  );

  // Handle user message submission
  const handleUserMessageSubmit = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      setIsLoading(true);

      try {
        // Save user message
        const userMessageId = nanoid();
        const userMessage: AIMessage = {
          id: userMessageId,
          timestamp: new Date(),
          message: {
            role: "user",
            content: message,
          },
          content: message,
        };
        saveNewMessage(userMessage);
        setMessages((prev) => [...prev, userMessage]);

        // Build message history for API
        const chatMessages: ChatMessage[] = [
          ...messages
            .filter(
              (m) => m.message.role === "user" || m.message.role === "assistant"
            )
            .map((m) => ({
              role: m.message.role as "user" | "assistant",
              content:
                typeof m.message.content === "string"
                  ? m.message.content
                  : JSON.stringify(m.message.content),
            })),
          {
            role: "user",
            content: message,
          },
        ];

        // Create loading assistant message
        const assistantMessageId = nanoid();
        const loadingMessage: AIMessage = {
          id: assistantMessageId,
          timestamp: new Date(),
          isLoading: true,
          message: {
            role: "assistant",
            content: "",
          },
          content: "",
        };
        setMessages((prev) => [...prev, loadingMessage]);

        // Send to backend
        let response = await sendMessage(chatMessages);

        // Handle tool calls
        while (response.toolCalls && response.toolCalls.length > 0) {
          // Execute tools
          const toolResults = await Promise.all(
            response.toolCalls.map(async (toolCall) => {
              const result = await executeTool(toolCall);
              return {
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                result,
              };
            })
          );

          // Add tool results to messages
          const toolMessages: ChatMessage[] = toolResults.map((tr) => ({
            role: "tool",
            content: [tr],
          }));

          // Send follow-up with tool results
          const followUpMessages: ChatMessage[] = [
            ...chatMessages,
            {
              role: "assistant",
              content: response.text || "",
            },
            ...toolMessages,
          ];

          response = await sendMessage(followUpMessages);
        }

        // Update assistant message with final response
        const finalMessage: AIMessage = {
          id: assistantMessageId,
          timestamp: new Date(),
          message: {
            role: "assistant",
            content: response.text,
          },
          content: <Markdown>{response.text}</Markdown>,
        };
        saveNewMessage(finalMessage);
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessageId ? finalMessage : m))
        );
      } catch (error) {
        console.error("AI chat error:", error);
        const errorMessage: AIMessage = {
          id: nanoid(),
          timestamp: new Date(),
          isError: true,
          message: {
            role: "assistant",
            content: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
          content: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
        saveNewMessage(errorMessage);
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, saveNewMessage, sendMessage, executeTool]
  );

  // Clear messages
  const clearMessages = useCallback(async () => {
    setMessages([]);
    await clearHistory();
  }, [clearHistory]);

  // Display messages with greeting
  const displayMessages = useMemo(() => {
    if (messages.length === 0 && historyMessages.length === 0) {
      const greeting = locale === "pt" ? GREETING_PT : GREETING_EN;
      return [
        {
          id: "greeting",
          timestamp: new Date(),
          message: {
            role: "assistant",
            content: greeting,
          },
          content: <Markdown>{greeting}</Markdown>,
        } as AIMessage,
      ];
    }
    return messages;
  }, [messages, historyMessages.length, locale]);

  return {
    messages: displayMessages,
    handleUserMessageSubmit,
    clearMessages,
  };
};
