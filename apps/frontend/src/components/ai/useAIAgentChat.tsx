import { ReactNode, useCallback } from "react";
import { CoreMessage, streamText } from "ai";
import { UAParser } from "ua-parser-js";
import { DownloadAILanguageModel } from "../atoms/DownloadAILanguageModel";
import { ChromeLocalLanguageModel } from "../../language-model/ChromeLocalLanguageModel";
import { z } from "zod";
import { useAIChatHistory } from "./useAIChatHistory";
import toast from "react-hot-toast";

export interface AIChatMessage {
  id: string;
  content: ReactNode;
  isUser: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  timestamp: Date;
}

const messageToAIMessage = (message: AIChatMessage): CoreMessage => {
  return {
    role: message.isUser ? "user" : "assistant",
    content: message.content?.toString() ?? "",
  };
};

export interface AIAgentChatResult {
  messages: AIChatMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

const INITIAL_SYSTEM_PROMPT = `
You are a helpful assistant to the TT3 product (an application to help with team scheduling shifts).
You are able to answer questions about the product and help with tasks.
`;

export const useAIAgentChat = (): AIAgentChatResult => {
  const { messages, saveNewMessage, clearMessages } = useAIChatHistory();

  const upsertMessage = useCallback(
    (message: AIChatMessage) => {
      // filter unwanted preambles
      if (
        !message.isUser &&
        message.content &&
        typeof message.content === "string"
      ) {
        message.content = message.content.replace("assistant said:", "");
        message.content = (message.content as string).replace("assistant:", "");
      }
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
                isUser: false,
                isWarning: true,
                timestamp: new Date(),
              });
              return;
            } else {
              upsertMessage({
                id: messageId,
                content: (
                  <p>
                    Even though your browser is Chrome, it currently does not
                    support AI, but you can start using it if you upgrade to
                    Chrome 127 or greater.
                  </p>
                ),
                isUser: false,
                isWarning: true,
                timestamp: new Date(),
              });
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
                    isUser: false,
                    isWarning: true,
                    timestamp: new Date(),
                  });
                  return;
                }
              }
            }
          }
        } else {
          upsertMessage({
            id: messageId,
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
            isUser: false,
            isWarning: true,
            timestamp: new Date(),
          });
          return;
        }
      }

      upsertMessage({
        id: messageId,
        content: "Error: " + error.message,
        isUser: false,
        isError: true,
        timestamp: new Date(),
      });
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
      const userMessage: AIChatMessage = {
        id: crypto.randomUUID(),
        content: message,
        isUser: true,
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
        content: "Thinking...",
        isUser: false,
        isLoading: true,
        timestamp: new Date(),
      });

      const result = await streamText({
        model,
        messages: allMessages.map(messageToAIMessage),
        tools: {
          get_current_time: {
            description: "Get the current time",
            parameters: z.any(),
            execute: async () => {
              return {
                time: new Date().toISOString(),
              };
            },
          },
        },
        toolChoice: "auto",
        maxSteps: 10,
        onError: ({ error }) => {
          handleError(error as Error, messageId);
        },
      });

      const { textStream, toolCalls, finishReason, toolResults } = result;
      let allTheText = "";

      for await (const textPart of textStream) {
        allTheText += textPart;
        upsertMessage({
          id: messageId,
          content: allTheText,
          isUser: false,
          isLoading: true,
          timestamp: new Date(),
        });
      }

      for (const toolCall of Object.values(await toolCalls)) {
        console.log("toolCall", toolCall);
      }

      for (const toolResult of Object.values(await toolResults)) {
        console.log("toolResult", toolResult);
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
          content: allTheText,
          isUser: false,
          isLoading: false,
          timestamp: new Date(),
        });
      }
    },
    [upsertMessage, messages, getModel, handleError]
  );

  return { messages, handleUserMessageSubmit, clearMessages };
};
