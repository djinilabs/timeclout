import { streamText } from "ai";
import { chromeai } from "chrome-ai";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { UAParser } from "ua-parser-js";

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
              content:
                "Your browser currently does not support AI, but you can start using it if you follow these instructions",
              isUser: false,
              isWarning: true,
              timestamp: new Date(),
            });
            return;
          } else {
            console.log("LanguageModel object is available");
            // The LanguageModel object is available
            // Let's query its availability
            const availability = await LanguageModel.availability;
            if (availability === "downloadable") {
              // The LanguageModel is downloadable
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
