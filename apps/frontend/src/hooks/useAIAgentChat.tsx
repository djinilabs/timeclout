import { ReactNode, useCallback, useMemo, useState } from "react";
import { streamText } from "ai";
import { chromeai } from "chrome-ai";
import { UAParser } from "ua-parser-js";
import { DownloadAILanguageModel } from "../components/atoms/DownloadAILanguageModel";

interface Message {
  id: string;
  content: ReactNode;
  isUser: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  timestamp: Date;
}

export const useAIAgentChat = () => {
  const model = useMemo(() => chromeai("text"), []);
  const [messages, setMessages] = useState<Message[]>([]);

  const upsertMessage = useCallback((message: Message) => {
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
      console.log("handleError", errorMessage);
      if (errorMessage.toLowerCase().includes("support")) {
        const { browser } = UAParser(navigator.userAgent);
        console.log("browser", browser);
        // The browser does not support AI
        // Let's first check if the browser is Chrome version 127 or greater
        if (browser.name === "Chrome" && (browser.major ?? "0") >= "127") {
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
                  <ol className="list-decimal space-y-2 mt-2">
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
            console.log("LanguageModel object is available");
            // The LanguageModel object is available
            const languageModel = window.LanguageModel as
              | LanguageModel
              | undefined;
            if (languageModel) {
              // Let's query its availability
              const availability = await languageModel.availability();
              console.log("availability", availability);
              if (availability === "available") {
                upsertMessage({
                  id: messageId,
                  content: (
                    <div>
                      <p>
                        Your browser currently does not support AI, but you can
                        start using it if you download it:
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

  const handleUserMessageSubmit = useCallback(
    async (message: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        isUser: true,
        timestamp: new Date(),
      };

      upsertMessage(userMessage);

      const messageId = crypto.randomUUID();

      const aiMessage: Message = {
        id: messageId,
        content: "",
        isUser: false,
        isLoading: true,
        timestamp: new Date(),
      };
      upsertMessage(aiMessage);

      console.log("Going to stream text...");

      const result = await streamText({
        model,
        prompt: message,
        onError: ({ error }) => {
          handleError(error as Error, messageId);
        },
        onChunk: (chunk) => {
          console.log("Chunk:", chunk);
        },
        onFinish: (result) => {
          console.log("Finish:", result);
        },
      });

      console.log(result);

      const { textStream } = result;

      console.log("Stream text started...");

      for await (const textPart of textStream) {
        upsertMessage({
          id: messageId,
          content: textPart,
          isUser: false,
          timestamp: new Date(),
        });
      }

      console.log("Stream text finished...");
    },
    [handleError, model, upsertMessage]
  );

  return { messages, handleUserMessageSubmit };
};
