import { ReactNode, useCallback } from "react";
import {
  CoreMessage,
  streamText,
  StreamTextResult,
  ToolCall,
  ToolContent,
} from "ai";
import { UAParser } from "ua-parser-js";
import { DownloadAILanguageModel } from "../atoms/DownloadAILanguageModel";
import { ChromeLocalLanguageModel } from "../../language-model/ChromeLocalLanguageModel";
import { useAIChatHistory } from "./useAIChatHistory";
import toast from "react-hot-toast";
import { tools } from "./tools";

// Base message type that extends CoreMessage
type BaseMessage = Omit<CoreMessage, "content"> & {
  id: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  isToolCall?: boolean;
  isToolResult?: boolean;
  toolResult?: ToolContent;
  toolCall?: ToolCall<string, unknown>;
};

// Message with string content (for AI SDK)
export type AIMessage = BaseMessage & {
  content: string;
};

// Message with React content (for UI)
export type ReactMessage = BaseMessage & {
  content: ReactNode;
};

// Union type for all possible message types
export type ExtendedCoreMessage = AIMessage | ReactMessage;

const chatMessageRoleToAIMessageRole = (
  message: ExtendedCoreMessage
): CoreMessage["role"] | undefined => {
  if (message.role === "user") {
    return "user";
  }
  if (message.isToolResult) {
    return "tool";
  }
  return "assistant";
};

const messageToAIMessage = (
  message: ExtendedCoreMessage
): CoreMessage | undefined => {
  const role = chatMessageRoleToAIMessageRole(message);
  if (!role) {
    return undefined;
  }
  if (role === "user" || role === "assistant") {
    // Convert ReactNode to string if needed
    const content =
      typeof message.content === "string"
        ? message.content
        : message.content?.toString() ?? "";
    return {
      role,
      content,
    };
  }
  if (role === "tool") {
    return {
      role,
      content: message.toolResult ?? [],
    };
  }
};

export interface AIAgentChatResult {
  messages: ExtendedCoreMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

const INITIAL_SYSTEM_PROMPT = `
You are a helpful assistant to the TT3 product (an application to help with team scheduling shifts).
You are able to answer questions about the product and help with tasks.
You should use the tools provided to you to answer questions and help with tasks.
If the user asks you to do something, you should use the tools provided to you to do it.
To use a tool, you need to provide a JSON object with the tool name and the arguments.
After you have received a tool-result, reply to the user in text with your findings.
You should always reply to the user in text, not JSON.
`;

export const useAIAgentChat = (): AIAgentChatResult => {
  const { messages, saveNewMessage, clearMessages } = useAIChatHistory();

  const upsertMessage = useCallback(
    (message: ExtendedCoreMessage) => {
      // Save to IndexedDB after state update
      saveNewMessage(message).catch((error) => {
        toast.error("Error saving message to IndexedDB: " + error.message);
      });
    },
    [saveNewMessage]
  );

  const handleError = useCallback(
    async (error: Error, messageId = crypto.randomUUID()) => {
      const errorMessage = error.message;
      console.log("handleError", error);
      const errorMessageLowerCased = errorMessage.toLowerCase();
      if (
        errorMessageLowerCased.includes("browser no support") ||
        errorMessageLowerCased.includes("languagemodel is not available")
      ) {
        const { browser } = UAParser(navigator.userAgent);
        // The browser does not support AI
        // Let's first check if the browser is Chrome version 127 or greater
        if (browser.name === "Chrome") {
          if ((browser.major ?? "0") >= "127") {
            // The browser is Chrome version 127 or greater

            // Is the LanguageModel object available?
            if (!("LanguageModel" in window)) {
              // Let's show a message to the user
              upsertMessage({
                id: messageId,
                role: "assistant",
                content: (
                  <div>
                    <p>
                      Your browser currently does not support AI, but you can
                      start using it if you follow these instructions:
                    </p>
                    <ol className="list-decimal space-y-2 mt-2 text-sm">
                      <li>
                        Go to this URL{" "}
                        <code>chrome://flags/#prompt-api-for-gemini-nano</code>{" "}
                        <br />
                        and enable the "Prompt API for Gemini Nano" flag.
                      </li>
                      <li>
                        Go to this URL{" "}
                        <code>
                          chrome://flags/#optimization-guide-on-device-model
                        </code>{" "}
                        <br />
                        and enable the "Optimization Guide On-Device Model" flag
                        <br />
                        and set it to "Enabled BypassPrefRequirement".
                      </li>
                      <li>Restart your browser</li>
                    </ol>
                  </div>
                ),
                isWarning: true,
                timestamp: new Date(),
              } as ReactMessage);
              return;
            } else {
              upsertMessage({
                id: messageId,
                role: "assistant",
                content: (
                  <p>
                    Even though your browser is Chrome, it currently does not
                    support AI, but you can start using it if you upgrade to
                    Chrome 127 or greater.
                  </p>
                ),
                isWarning: true,
                timestamp: new Date(),
              } as ReactMessage);
              console.log("LanguageModel object is available");
              // The LanguageModel object is available
              const languageModel = window.LanguageModel as
                | LanguageModel
                | undefined;
              if (languageModel) {
                // Let's query its availability
                const availability = await languageModel.availability();
                console.log("availability", availability);
                if (
                  availability === "downloadable" ||
                  availability === "downloading"
                ) {
                  upsertMessage({
                    id: messageId,
                    role: "assistant",
                    content: (
                      <div>
                        <p>
                          {availability === "downloadable"
                            ? "Your browser currently does not support AI, but you can start using it if you download it:"
                            : availability === "downloading"
                            ? "Downloading the model..."
                            : null}
                        </p>
                        <DownloadAILanguageModel />
                      </div>
                    ),
                    isWarning: true,
                    timestamp: new Date(),
                  } as ReactMessage);
                  return;
                }
              }
            }
          }
        } else {
          upsertMessage({
            id: messageId,
            role: "assistant",
            content: (
              <div>
                <p>
                  Your browser is not Chrome, so it currently does not support
                  AI.
                </p>
                <ol className="space-y-2 mt-2 text-sm">
                  <li>
                    To install Chrome you can download it from{" "}
                    <a target="_blank" href="https://www.google.com/chrome/">
                      https://www.google.com/chrome/
                    </a>
                  </li>
                </ol>
              </div>
            ),
            isWarning: true,
            timestamp: new Date(),
          } as ReactMessage);
          return;
        }
      }

      upsertMessage({
        id: messageId,
        role: "assistant",
        content: "Error: " + error.message,
        isError: true,
        timestamp: new Date(),
      } as AIMessage);
    },
    [upsertMessage]
  );

  const getModel = useCallback(
    (forMessageId: string) => {
      try {
        return new ChromeLocalLanguageModel("text", {
          initialPrompts: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  value: INITIAL_SYSTEM_PROMPT,
                },
              ],
            },
          ],
        });
      } catch (error) {
        handleError(error as Error, forMessageId);
        return null;
      }
    },
    [handleError]
  );

  const handleUserMessageSubmit = useCallback(
    async (message: string) => {
      const userMessage: AIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      upsertMessage(userMessage);

      const allMessages = [...messages, userMessage];

      const messageId = crypto.randomUUID();

      const model = getModel(messageId);
      if (!model) {
        return;
      }

      upsertMessage({
        id: messageId,
        role: "assistant",
        content: "Thinking...",
        isLoading: true,
        timestamp: new Date(),
      } as AIMessage);

      let result: StreamTextResult<typeof tools, never> | undefined;

      try {
        result = await streamText({
          model,
          maxSteps: 10,
          messages: allMessages
            .map(messageToAIMessage)
            .filter((message): message is CoreMessage => message !== undefined),
          tools,
          toolChoice: "auto",
          onError: ({ error }) => {
            handleError(error as Error, messageId);
          },
        });
      } catch (error) {
        handleError(error as Error, messageId);
        return;
      }

      if (!result) {
        return;
      }

      const { textStream, toolCalls, finishReason, toolResults } = result;
      let allTheText = "";

      for await (const textPart of textStream) {
        allTheText += textPart;
        upsertMessage({
          id: messageId,
          role: "assistant",
          content: allTheText,
          isLoading: true,
          timestamp: new Date(),
        } as AIMessage);
      }

      for (const toolCall of Object.values(await toolCalls)) {
        upsertMessage({
          id: messageId,
          role: "assistant",
          content: JSON.stringify(toolCall, null, 2),
          toolCall: toolCall,
          isToolCall: true,
          timestamp: new Date(),
        } as AIMessage);
      }

      for (const toolResult of Object.values(await toolResults)) {
        upsertMessage({
          id: messageId,
          role: "assistant",
          content: JSON.stringify(toolResult, null, 2),
          toolResult: [toolResult],
          isToolResult: true,
          timestamp: new Date(),
        } as AIMessage);
      }

      if ((await finishReason) === "error") {
        handleError(
          new Error("An error occurred while generating the response"),
          messageId
        );
      }

      if (allTheText) {
        upsertMessage({
          id: messageId,
          role: "assistant",
          content: allTheText,
          isLoading: false,
          timestamp: new Date(),
        } as AIMessage);
      }

      console.log("finishReason", finishReason);
    },
    [upsertMessage, messages, getModel, handleError]
  );

  return { messages, handleUserMessageSubmit, clearMessages };
};
