import { useCallback, useState } from "react";

import { type AIMessage } from "./types";

export const useAIChatHistory = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const saveNewMessage = useCallback((message: AIMessage): void => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      if (exists) {
        return prev.map((m) => (m.id === message.id ? message : m));
      } else {
        return [...prev, message];
      }
    });
  }, []);

  const clearMessages = useCallback(async (): Promise<void> => {
    setMessages([]);
  }, []);

  return {
    messages: [...messages],
    saveNewMessage,
    clearMessages,
    loading: false,
  };
};
