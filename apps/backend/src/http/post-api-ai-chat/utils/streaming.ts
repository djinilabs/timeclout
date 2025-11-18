import type { TokenUsage } from "./continuation";
import { handleToolContinuation } from "./continuation";

export interface ProcessResponseResult {
  text: string;
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
 * Processes the non-streaming AI response and handles tool calls
 */
export async function processNonStreamingResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AI SDK generateText result types are complex
  result: any,
  systemPrompt: string,
  model: ReturnType<typeof import("@ai-sdk/google").createGoogleGenerativeAI>,
  messages: unknown[]
): Promise<ProcessResponseResult> {
  // Extract text, tool calls, and tool results from generateText result
  let finalText: string;
  let toolCalls: unknown[];
  let toolResults: unknown[];
  try {
    [finalText, toolCalls, toolResults] = await Promise.all([
      Promise.resolve(result.text),
      Promise.resolve(result.toolCalls || []),
      Promise.resolve(result.toolResults || []),
    ]);
  } catch (error) {
    console.error("[AI Chat] Error extracting result data:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }

  const initialTokenUsage = extractTokenUsage(result);
  const hasText = finalText && finalText.trim().length > 0;
  const hasToolResults = toolResults && toolResults.length > 0;

  // Handle continuation if tools were executed but no text was generated
  // Note: For client-side tools, toolResults will be empty here since tools execute on frontend
  // Continuation will be handled when the frontend sends tool results back
  if (
    hasToolResults &&
    !hasText &&
    toolCalls &&
    toolCalls.length > 0 &&
    toolResults &&
    toolResults.length > 0
  ) {
    const continuationResult = await handleToolContinuation(
      systemPrompt,
      model,
      messages,
      toolCalls,
      toolResults
    );
    if (continuationResult) {
      // Aggregate token usage from initial and continuation calls
      const aggregatedTokenUsage = continuationResult.tokenUsage
        ? {
            promptTokens:
              (initialTokenUsage?.promptTokens || 0) +
              (continuationResult.tokenUsage.promptTokens || 0),
            completionTokens:
              (initialTokenUsage?.completionTokens || 0) +
              (continuationResult.tokenUsage.completionTokens || 0),
            totalTokens:
              (initialTokenUsage?.totalTokens || 0) +
              (continuationResult.tokenUsage.totalTokens || 0),
          }
        : initialTokenUsage;

      return {
        text: continuationResult.text || "",
        tokenUsage: aggregatedTokenUsage,
      };
    }
  }

  // Return final text, or empty string if none
  return {
    text: finalText || "",
    tokenUsage: initialTokenUsage,
  };
}

