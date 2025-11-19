import { nanoid } from "nanoid";
import { useCallback, useMemo, useState } from "react";

import { findFirstElementInAOM } from "../../accessibility/findFirstElement";
import { generateAccessibilityObjectModel } from "../../accessibility/generateAOM";
import { printAOM } from "../../accessibility/printAOM";
import { AccessibleElement } from "../../accessibility/types";
import { useFetchActivity } from "../../hooks/useFetchActivity";
import { useLocale } from "../../hooks/useLocale";
import { searchDocuments } from "../../utils/docSearchManager";
import { timeout } from "../../utils/timeout";

import { ActivityDebouncer } from "./ActivityDebouncer";
import { type AIMessage } from "./types";
import { useAIChatHistory } from "./useAIChatHistory";

// Greeting messages
const GREETING_EN =
  "Hello, I'm your TimeClout AI assistant. How can I help you today?";
const GREETING_PT =
  "Olá, sou o seu assistente de IA do TimeClout. Como posso ajudá-lo hoje?";

// API URL for backend
const API_URL = "/api/ai/chat";

// Helper functions for tool execution (from main branch)
const clickableRoles = ["button", "link", "checkbox", "radio", "combobox"];
const isElementClickable = (element: AccessibleElement) => {
  return (
    !!element.attributes.clickable || clickableRoles.includes(element.role)
  );
};

const simulateClick = (element: AccessibleElement) => {
  if (element.domElement instanceof HTMLElement) {
    element.domElement.click();
  }
};

const simulateTyping = (
  element: HTMLInputElement | HTMLTextAreaElement,
  text: string
) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    (element instanceof HTMLInputElement
      ? HTMLInputElement
      : HTMLTextAreaElement
    ).prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(element, text);
};

/**
 * Tool execution functions (from main branch implementation)
 */
const executeDescribeAppUI = async (): Promise<string> => {
  console.log("tool call: describe_app_ui");
  const aom = generateAccessibilityObjectModel(document);
  return printAOM(aom);
};

const executeClickElement = async (
  role: string,
  description: string,
  debounceActivity: () => Promise<void>
): Promise<{ success: boolean; error?: string }> => {
  console.log("tool call: click_element", role, description);
  const aom = generateAccessibilityObjectModel(document, true);
  const element = findFirstElementInAOM(aom, role, description);
  if (element) {
    console.log("Element found", element);
    if (!isElementClickable(element)) {
      console.log("Element is not clickable", element);
      return {
        success: false,
        error:
          "Element is not clickable. Perhaps try clicking on a sub-element of this element.",
      };
    }
    //  ------------- click the element -------------

    if (element.domElement instanceof HTMLElement) {
      console.log("Clicking element", element.domElement);
      simulateClick(element);
      await debounceActivity();
    } else {
      console.log("Element is not an HTMLElement", element);
      return {
        success: false,
        error: "Element is not an HTMLElement",
      };
    }
    console.log("Element clicked with success", element);
    return { success: true };
  }
  console.log(
    "Element with the following role and description not found: role: ",
    role,
    "description: ",
    description
  );
  return {
    success: false,
    error: `Element with the following role and description not found: role: ${role}, description: ${description}`,
  };
};

const executeFillFormElement = async (
  role: string,
  description: string,
  value: string,
  debounceActivity: () => Promise<void>
): Promise<{ success: boolean; error?: string }> => {
  console.log("tool call: fill_form_element", role, description, value);
  const aom = generateAccessibilityObjectModel(document, true);
  const element = findFirstElementInAOM(aom, role, description);

  if (!element) {
    console.log(
      "Element with the following role and description not found: role: ",
      role,
      "description: ",
      description
    );
    return {
      success: false,
      error: `Element with the following role and description not found: role: ${role}, description: ${description}`,
    };
  }

  if (!element.domElement) {
    return {
      success: false,
      error: "Element has no DOM element",
    };
  }

  const domElement = element.domElement as HTMLElement;

  try {
    domElement.focus();
    // Handle different types of form elements
    if (domElement instanceof HTMLInputElement) {
      // if the role is "combobox", open it first, and then click the matching element
      if (element.role === "combobox") {
        console.log("Element is a combobox, opening it");
        domElement.click();
        await debounceActivity();
      }

      if (domElement.type === "checkbox") {
        domElement.checked = value.toLowerCase() === "true";
      } else if (domElement.type === "radio") {
        domElement.checked = true;
      } else {
        simulateTyping(domElement, value);
      }
    } else if (domElement instanceof HTMLTextAreaElement) {
      domElement.value = value;
    } else if (domElement instanceof HTMLSelectElement) {
      console.log("Element is a select element, setting value to", value);
      domElement.value = value;
    } else {
      return {
        success: false,
        error: "Element is not a form input element",
      };
    }

    await timeout(100);

    // Trigger input event to ensure React/other frameworks detect the change
    document.dispatchEvent(new Event("change", { bubbles: true }));
    document.dispatchEvent(new Event("input", { bubbles: true }));
    domElement.dispatchEvent(new Event("change", { bubbles: true }));
    domElement.dispatchEvent(new Event("input", { bubbles: true }));
    await debounceActivity();

    return { success: true };
  } catch (error) {
    console.error("Error filling form element:", error);
    return {
      success: false,
      error: `Error filling form element: ${error}`,
    };
  }
};

const executeSearchDocuments = async (
  query: string,
  topN: number = 5
): Promise<string> => {
  console.log("tool call: search_documents", query, topN);
  try {
    const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "";
    const apiUrl = `${BACKEND_API_URL}/api/ai/embedding`;

    const results = await searchDocuments(query, topN, apiUrl);

    if (results.length === 0) {
      return "No relevant documents found for the query.";
    }

    // Format results similar to helpmaton
    const formattedResults = results
      .map((result) => result.snippet)
      .join("\n\n---\n\n");

    return `Found ${results.length} relevant document snippet(s):\n\n${formattedResults}`;
  } catch (error) {
    console.error("Error in search_documents tool:", error);
    return `Error searching documents: ${
      error instanceof Error ? error.message : String(error)
    }`;
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
  const { saveNewMessage, clearMessages: clearHistory } = useAIChatHistory();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get activity debouncer (from main branch pattern)
  const { monitorFetch } = useFetchActivity();
  const { debounceActivity } = useMemo(
    () => ActivityDebouncer(monitorFetch),
    [monitorFetch]
  );

  // Execute tool and get result (from main branch implementation)
  const executeTool = useCallback(
    async (toolCall: {
      toolCallId: string;
      toolName: string;
      args?: unknown;
      input?: unknown;
    }): Promise<unknown> => {
      console.log("executeTool", JSON.stringify(toolCall, null, 2));
      const { toolName, input, args } = toolCall;

      // Tool call arguments can be in 'input' or 'args' property
      // Prefer 'input' as that's the format from AI SDK
      const rawArgs = input !== undefined ? input : args;

      // Ensure args is an object, default to empty object if undefined or not an object
      const argsObj =
        rawArgs && typeof rawArgs === "object" && !Array.isArray(rawArgs)
          ? (rawArgs as Record<string, unknown>)
          : {};

      try {
        switch (toolName) {
          case "describe_app_ui":
            return await executeDescribeAppUI();
          case "click_element": {
            // Handle both parameter name formats (role/description from backend, element-role/element-description from main branch)
            const clickRole =
              (argsObj["element-role"] as string) ||
              (argsObj.role as string) ||
              "";
            const clickDescription =
              (argsObj["element-description"] as string) ||
              (argsObj.description as string) ||
              "";
            return await executeClickElement(
              clickRole,
              clickDescription,
              debounceActivity
            );
          }
          case "fill_form_element": {
            // Handle both parameter name formats
            const fillRole =
              (argsObj["element-role"] as string) ||
              (argsObj.role as string) ||
              "";
            const fillDescription =
              (argsObj["element-description"] as string) ||
              (argsObj.description as string) ||
              "";
            return await executeFillFormElement(
              fillRole,
              fillDescription,
              (argsObj.value as string) || "",
              debounceActivity
            );
          }
          case "search_documents":
            return await executeSearchDocuments(
              (argsObj.query as string) || "",
              (argsObj.topN as number) || 5
            );
          default:
            return { error: `Unknown tool: ${toolName}` };
        }
      } catch (error) {
        console.error(`Error executing tool ${toolName}:`, error);
        return {
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    [debounceActivity]
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

        // Handle tool calls with safety limit to prevent infinite loops
        let toolCallIterations = 0;
        const MAX_TOOL_CALL_ITERATIONS = 10;

        while (
          response.toolCalls &&
          response.toolCalls.length > 0 &&
          toolCallIterations < MAX_TOOL_CALL_ITERATIONS
        ) {
          toolCallIterations++;

          // Execute tools
          const toolResults = await Promise.all(
            response.toolCalls.map(async (toolCall) => {
              try {
                const result = await executeTool(toolCall);
                // Check if result contains an error
                if (result && typeof result === "object" && "error" in result) {
                  console.error(
                    `Tool ${toolCall.toolName} returned an error:`,
                    result
                  );
                }
                return {
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  result,
                };
              } catch (error) {
                console.error(
                  `Error executing tool ${toolCall.toolName}:`,
                  error
                );
                return {
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  result: {
                    error:
                      error instanceof Error ? error.message : String(error),
                  },
                };
              }
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

        // Warn if we hit the iteration limit
        if (toolCallIterations >= MAX_TOOL_CALL_ITERATIONS) {
          console.warn(
            "Tool call iteration limit reached. This may indicate an infinite loop."
          );
        }

        // Update assistant message with final response
        const finalMessage: AIMessage = {
          id: assistantMessageId,
          timestamp: new Date(),
          message: {
            role: "assistant",
            content: response.text,
          },
          content: response.text, // Store as string - AIChatMessagePanel will render Markdown
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
    if (messages.length === 0) {
      const greeting = locale === "pt" ? GREETING_PT : GREETING_EN;
      return [
        {
          id: "greeting",
          timestamp: new Date(),
          message: {
            role: "assistant",
            content: greeting,
          },
          content: greeting, // Store as string - AIChatMessagePanel will render Markdown
        } as AIMessage,
      ];
    }
    return messages;
  }, [messages, locale]);

  return {
    messages: displayMessages,
    handleUserMessageSubmit,
    clearMessages,
  };
};
