import { ReactNode } from "react";
import { z } from "zod";

export type CoreMessage =
  | {
      role: "user";
      content: string;
    }
  | {
      role: "assistant";
      content: string;
    }
  | {
      role: "tool";
      content: unknown[];
    };

export type AIMessage = {
  id: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  message: CoreMessage;
  content: ReactNode;
};

const AIMessageValidator = z.object({
  id: z.string(),
  timestamp: z.date(),
  isLoading: z.boolean().optional(),
  isError: z.boolean().optional(),
  isWarning: z.boolean().optional(),
  message: z.union([
    z.object({
      role: z.literal("user"),
      content: z.string(),
    }),
    z.object({
      role: z.literal("assistant"),
      content: z.string(),
    }),
    z.object({
      role: z.literal("tool"),
      content: z.array(z.any()),
    }),
  ]),
});

export const isAiMessageValid = (message: unknown): message is AIMessage => {
  return AIMessageValidator.safeParse(message).success;
};
