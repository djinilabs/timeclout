import { ReactNode, useCallback, useState } from "react";
import { CoreMessage, streamText } from "ai";
import { UAParser } from "ua-parser-js";
import { DownloadAILanguageModel } from "../atoms/DownloadAILanguageModel";
import { ChromeLocalLanguageModel } from "../../language-model/ChromeLocalLanguageModel";

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

export const useAIAgentChat = () => {
  const upsertMessage = useCallback((message: AIChatMessage) => {
    setMessages((prev) => {
      const containsMessage = prev.some((m) => m.id === message.id);
      if (containsMessage) {
        return prev.map((m) => (m.id === message.id ? message : m));
      } else {
        return [...prev, message];
      }
    });
  }, []);

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
                  value:
                    "You are a helpful assistant to the TT3 product (an application to help with team scheduling shifts). You are able to answer questions about the product and help with tasks.",
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
  const [messages, setMessages] = useState<AIChatMessage[]>([]);

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

      const aiMessage: AIChatMessage = {
        id: messageId,
        content: "",
        isUser: false,
        isLoading: true,
        timestamp: new Date(),
      };
      upsertMessage(aiMessage);

      console.log("Going to stream text...");

      const model = getModel(messageId);

      if (!model) {
        return;
      }

      const result = await streamText({
        model,
        messages: allMessages.map(messageToAIMessage),
        onError: ({ error }) => {
          handleError(error as Error, messageId);
        },
      });

      console.log(result);

      const { textStream } = result;

      console.log("Stream text started...");

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

      upsertMessage({
        id: messageId,
        content: allTheText,
        isUser: false,
        isLoading: false,
        timestamp: new Date(),
      });

      console.log("Stream text finished...");
    },
    [upsertMessage, messages, getModel, handleError]
  );

  return { messages, handleUserMessageSubmit };
};
