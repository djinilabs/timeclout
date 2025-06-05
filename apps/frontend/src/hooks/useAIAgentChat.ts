import { streamText } from "ai";
import { chromeai } from "chrome-ai";
import { useCallback, useMemo, useState } from "react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isLoading?: boolean;
  isError?: boolean;
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
          console.error("Error:", error);
          upsertMessage({
            id: messageId,
            content: "Error: " + (error as unknown as Error).message,
            isUser: false,
            isError: true,
            timestamp: new Date(),
          });
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
    [model, upsertMessage]
  );

  return { messages, handleUserMessageSubmit };
};
