import { useCallback } from "react";
import { streamText, StreamTextResult } from "ai";
import { UAParser } from "ua-parser-js";
import { DownloadAILanguageModel } from "../atoms/DownloadAILanguageModel";
import { ChromeLocalLanguageModel } from "../../language-model/ChromeLocalLanguageModel";
import { useAIChatHistory } from "./useAIChatHistory";
import toast from "react-hot-toast";
import { tools } from "./tools";
import { nanoid } from "nanoid";
import { AIMessage } from "./types";

export interface AIAgentChatResult {
  messages: AIMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

const INITIAL_SYSTEM_PROMPT = `
You are a helpful assistant that lives inside the TT3 product (an application to help with team scheduling shifts).
You can interact with the TT3 product like if you were a user of the application.
You should use the tools provided to you to answer questions and help with tasks.
Don't plan, just act.
If the user asks you to do something, you should try to use the provided tools.
To use a tool, you need to provide a JSON object with the tool name and the arguments.
After you have received a tool-result, reply to the user in __plain english__ with your findings.
`;

export const useAIAgentChat = (): AIAgentChatResult => {
  const { messages, saveNewMessage, clearMessages } = useAIChatHistory();

  const upsertMessage = useCallback(
    async (message: AIMessage) => {
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
              await upsertMessage({
                id: messageId,
                message: {
                  role: "assistant",
                  content: "Thinking...",
                },
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
              });
              return;
            } else {
              await upsertMessage({
                id: messageId,
                message: {
                  role: "assistant",
                  content: "Thinking...",
                },
                content: (
                  <p>
                    Even though your browser is Chrome, it currently does not
                    support AI, but you can start using it if you upgrade to
                    Chrome 127 or greater.
                  </p>
                ),
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
                  await upsertMessage({
                    id: messageId,
                    message: {
                      role: "assistant",
                      content: "Thinking...",
                    },
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
                  });
                  return;
                }
              }
            }
          }
        } else {
          await upsertMessage({
            id: messageId,
            message: {
              role: "assistant",
              content: "Thinking...",
            },
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
          });
          return;
        }
      }

      await upsertMessage({
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
        id: nanoid(),
        content: message,
        timestamp: new Date(),
        message: {
          role: "user",
          content: message,
        },
      };

      await upsertMessage(userMessage);

      const allMessages = [...messages, userMessage];

      const messageId = crypto.randomUUID();

      const model = getModel(messageId);
      if (!model) {
        return;
      }

      await upsertMessage({
        id: messageId,
        timestamp: new Date(),
        content: "Thinking...",
        isLoading: true,
        message: {
          role: "assistant",
          content: "Thinking...",
        },
      });

      let result: StreamTextResult<typeof tools, never> | undefined;

      try {
        result = await streamText({
          model,
          maxSteps: 10,
          messages: allMessages.map((message) => message.message),
          tools,
          toolChoice: "auto",
          toolCallStreaming: true,
          onError: ({ error }) => {
            handleError(error as Error, messageId);
          },
        });
      } catch (error) {
        await handleError(error as Error, messageId);
        return;
      }

      console.log("result", result);

      if (!result) {
        return;
      }

      const { textStream, toolCalls, finishReason, toolResults } = result;
      let allTheText = "";

      for await (const textPart of textStream) {
        allTheText += textPart;
        await upsertMessage({
          id: messageId,
          timestamp: new Date(),
          content: allTheText,
          isLoading: true,
          message: {
            role: "assistant",
            content: allTheText,
          },
        });
      }

      for (const toolCall of Object.values(await toolCalls)) {
        await upsertMessage({
          id: messageId,
          timestamp: new Date(),
          content: JSON.stringify(toolCall, null, 2),
          message: {
            role: "assistant",
            content: JSON.stringify(toolCall, null, 2),
          },
        });
      }

      for (const toolResult of Object.values(await toolResults)) {
        await upsertMessage({
          id: messageId,
          timestamp: new Date(),
          content: JSON.stringify(toolResult, null, 2),
          message: {
            role: "tool",
            content: [toolResult],
          },
        });
      }

      if (allTheText) {
        await upsertMessage({
          id: messageId,
          timestamp: new Date(),
          content: allTheText,
          isLoading: false,
          message: {
            role: "assistant",
            content: allTheText,
          },
        });
      }

      if ((await finishReason) === "error") {
        await handleError(
          new Error("An error occurred while generating the response"),
          messageId
        );
      }
      console.log("finishReason", finishReason);
    },
    [upsertMessage, messages, getModel, handleError]
  );

  return { messages, handleUserMessageSubmit, clearMessages };
};
