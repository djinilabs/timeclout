import type { ModelMessage } from "ai";
import { generateText } from "ai";

import { convertUIMessagesToModelMessages } from "./messageConversion";
import {
  formatToolCallMessage,
  formatToolResultMessage,
} from "./toolFormatting";
import type { UIMessage } from "./types";

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export interface ContinuationResult {
  text: string | null;
  tokenUsage: TokenUsage | undefined;
}

/**
 * Extracts token usage from generateText result
 */
function extractTokenUsage(result: {
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}): TokenUsage | undefined {
  if (!result.usage) {
    return undefined;
  }
  return {
    promptTokens: result.usage.promptTokens || 0,
    completionTokens: result.usage.completionTokens || 0,
    totalTokens: result.usage.totalTokens || 0,
  };
}

/**
 * Builds continuation instructions based on tool result types
 */
export function buildContinuationInstructions(
  toolResults: Array<{ toolName?: string }>
): string {
  const hasSearchResult = toolResults.some(
    (tr) => tr?.toolName === "search_documents"
  );

  let instructions = "";
  if (hasSearchResult) {
    instructions +=
      "IMPORTANT: When you receive tool results from document searches, you must provide a helpful summary and interpretation. DO NOT simply repeat or copy the raw tool results verbatim. Instead, synthesize the information, extract key points, and provide insights or answers based on what was found. Be concise and focus on what the user asked about.\n\n";
  }

  return instructions;
}

/**
 * Handles continuation when tools are called but no text is generated
 * Returns the continuation text and token usage, or null if no text was generated
 */
export async function handleToolContinuation(
  systemPrompt: string,
  model: ReturnType<typeof import("@ai-sdk/google").createGoogleGenerativeAI>,
  messages: unknown[],
  toolCalls: unknown[],
  toolResults: unknown[]
): Promise<ContinuationResult | null> {
  const continuationInstructions = buildContinuationInstructions(
    toolResults.filter(
      (tr): tr is { toolName?: string } =>
        tr != null && typeof tr === "object" && "toolName" in tr
    )
  );

  // Format tool calls and results as UI messages
  const toolCallUIMessages = toolCalls
    .filter((tc): tc is NonNullable<typeof tc> => tc != null)
    .map(formatToolCallMessage);

  const toolResultUIMessages = toolResults
    .filter((tr): tr is NonNullable<typeof tr> => tr != null)
    .map(formatToolResultMessage);

  // Combine messages, filtering out existing tool messages and system messages
  // (system prompt is passed separately via the system parameter to generateText)
  const allMessagesForContinuation: UIMessage[] = [
    ...messages.filter((msg): msg is UIMessage => {
      if (
        !(
          msg != null &&
          typeof msg === "object" &&
          "role" in msg &&
          typeof msg.role === "string" &&
          (msg.role === "user" ||
            msg.role === "assistant" ||
            msg.role === "system" ||
            msg.role === "tool") &&
          "content" in msg
        )
      ) {
        return false;
      }

      // Filter out system messages since we pass system separately
      if (msg.role === "system") {
        return false;
      }

      // Filter out tool messages (we'll add tool results separately as assistant messages)
      if (msg.role === "tool") {
        return false;
      }

      return true;
    }),
    ...toolCallUIMessages,
    ...toolResultUIMessages,
  ];

  console.log(
    "[Continuation] allMessagesForContinuation",
    JSON.stringify(allMessagesForContinuation, null, 2)
  );

  let continuationModelMessages: ModelMessage[];
  try {
    continuationModelMessages = convertUIMessagesToModelMessages(
      allMessagesForContinuation
    );
  } catch (error) {
    console.error(
      "[AI Chat] Error converting messages for continuation:",
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }
    );
    throw error;
  }

  const continuationSystemPrompt = `${systemPrompt}\n\n${continuationInstructions}`;

  let continuationResult;

  console.log(
    "[Continuation] continuationModelMessages",
    JSON.stringify(continuationModelMessages, null, 2)
  );

  try {
    continuationResult = await generateText({
      model: model("gemini-2.5-flash-preview-05-20") as unknown as Parameters<
        typeof generateText
      >[0]["model"],
      system: continuationSystemPrompt,
      messages: continuationModelMessages,
    });
  } catch (error) {
    console.error("[AI Chat] Error in generateText continuation:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }

  // Get continuation text and token usage
  let continuationText: string;
  const continuationTokenUsage = extractTokenUsage(continuationResult);
  try {
    continuationText = continuationResult.text;
  } catch (error) {
    console.error("[AI Chat] Error getting continuation text:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }

  // If no continuation text was generated (final text is empty), use the latest tool result as the reply
  const hasFinalText = continuationText && continuationText.trim().length > 0;
  if (!hasFinalText && toolResultUIMessages.length > 0) {
    // Get the latest tool result message (which is formatted as an assistant message)
    const latestToolResultMessage =
      toolResultUIMessages[toolResultUIMessages.length - 1];

    // Extract text from tool result content
    // The tool result is in the content array as { type: 'tool-result', result: ... }
    let toolResultText: string | undefined;

    if (
      latestToolResultMessage &&
      latestToolResultMessage.role === "assistant" &&
      Array.isArray(latestToolResultMessage.content)
    ) {
      // Find the tool-result in the content array
      for (const item of latestToolResultMessage.content) {
        if (
          typeof item === "object" &&
          item !== null &&
          "type" in item &&
          item.type === "tool-result"
        ) {
          // Check for both "result" (from UI messages) and "output" (from converted ModelMessages)
          const result =
            "result" in item && item.result !== undefined
              ? item.result
              : "output" in item && item.output !== undefined
              ? item.output
              : undefined;

          if (result === undefined) {
            continue;
          }

          // Handle different result formats
          if (typeof result === "string") {
            toolResultText = result;
          } else if (
            result &&
            typeof result === "object" &&
            "type" in result &&
            "value" in result
          ) {
            // LanguageModelV2ToolResultOutput format: { type: 'text', value: string }
            if (result.type === "text" && typeof result.value === "string") {
              toolResultText = result.value;
            } else if (result.type === "json") {
              // For JSON outputs, stringify them
              toolResultText = JSON.stringify(result.value);
            }
          } else if (result) {
            toolResultText = String(result);
          }
          break; // Use the first tool-result found
        }
      }
    }

    if (toolResultText && toolResultText.trim().length > 0) {
      console.log("[Continuation] Using tool result as reply:", toolResultText);
      return {
        text: toolResultText,
        tokenUsage: continuationTokenUsage,
      };
    } else {
      console.log("[Continuation] No tool result text found to use as reply", {
        latestToolResultMessage,
        toolResultUIMessages: toolResultUIMessages.length,
      });
    }
  }

  console.log("[Continuation] Final result:", {
    hasContinuationText: continuationText?.trim().length > 0,
    continuationTextLength: continuationText?.length || 0,
    hasFinalText,
    hasToolResultFallback: !hasFinalText && toolResultUIMessages.length > 0,
    toolResultUIMessagesCount: toolResultUIMessages.length,
  });

  return hasFinalText
    ? {
        text: continuationText,
        tokenUsage: continuationTokenUsage,
      }
    : null;
}

