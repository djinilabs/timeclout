import { AIMessage } from "./types";

export interface AIAgentChatResult {
  messages: AIMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useAIAgentChat = (): AIAgentChatResult => {
  return {
    messages: [],
    handleUserMessageSubmit: async () => {
      // No-op
    },
    clearMessages: async () => {
      // No-op
    },
  };
};
