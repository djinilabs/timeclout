import {
  LanguageModelV2CallOptions,
  LanguageModelV2ToolCall,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";
import { nanoid } from "nanoid";

import { areAllBracesBalanced } from "./areAllBracesBalanced";

export const objectStartSequence = " ```json\n";
export const objectStopSequence = "\n```";

export type ToolCall = LanguageModelV2ToolCall;

/**
 * Detects if the buffered content is starting to look like a JSON object with a tool_name attribute.
 * Returns:
 * - ToolCall: if it's definitely a JSON object with tool_name
 * - false: if it's definitely not (not JSON or JSON is complete without tool_name)
 * - undefined: if it's still undecided (incomplete JSON or ambiguous)
 */
export function isToolCall(
  bufferedContent: string
): ToolCall | false | undefined {
  // Remove any leading/trailing whitespace
  const content = bufferedContent.trim();

  // Check if content starts with code block markers
  const codeBlockStart = content.match(/^```(\S*)?\s*/i);
  const cleanContent = (
    codeBlockStart ? content.slice(codeBlockStart[0].length) : content
  ).trim();

  // If content is empty after removing markers, we're still undecided
  if (!cleanContent) return undefined;

  // Fail fast if content doesn't start with {
  if (!cleanContent.startsWith("{")) {
    return false;
  }

  // Check if we have a complete JSON object
  try {
    const json = JSON.parse(cleanContent);
    if (typeof json === "object" && json !== null && "toolName" in json) {
      return {
        type: "tool-call",
        toolCallId: nanoid(),
        toolName: json.toolName,
        input: json.args ? JSON.stringify(json.args) : "",
      };
    }
  } catch {
    // If JSON parsing fails, check if it looks like an incomplete JSON object
    if (!areAllBracesBalanced(cleanContent)) {
      return undefined;
    }

    return false;
  }
}

const cleanChunk = (chunk: string, bufferedContent: string) => {
  // if the chunk starts with the bufferedContent, remove the bufferedContent
  if (chunk.startsWith(bufferedContent)) {
    return chunk.slice(bufferedContent.length);
  }
  return chunk;
};

export class StreamAI extends TransformStream<
  string,
  LanguageModelV2StreamPart
> {
  public constructor(options: LanguageModelV2CallOptions) {
    let buffer = "";
    let transforming = false;
    let toolCall: ToolCall | false | undefined = undefined;
    let enqueuedToolCall = false;
    let finished = false;

    const reset = () => {
      buffer = "";
      transforming = false;
    };

    super({
      start: (controller) => {
        reset();
        options.abortSignal?.addEventListener("abort", () => {
          controller.terminate();
        });
      },
      transform: (_chunk, controller) => {
        if (finished) {
          return;
        }
        let chunk = cleanChunk(_chunk, buffer); // See: https://github.com/jeasonstudio/chrome-ai/issues/11
        let newBuffer = buffer + chunk;
        if (options.responseFormat?.type === "json") {
          transforming =
            newBuffer.startsWith(objectStartSequence) &&
            !newBuffer.endsWith(objectStopSequence);
          newBuffer = newBuffer.replace(
            new RegExp("^" + objectStartSequence, "ig"),
            ""
          );
          newBuffer = newBuffer.replace(
            new RegExp(objectStopSequence + "$", "ig"),
            ""
          );
        } else if (toolCall === undefined) {
          const toolCallResult = isToolCall(newBuffer);
          switch (toolCallResult) {
            case false:
              transforming = true;
              toolCall = false;
              chunk = newBuffer;
              break;
            case undefined:
              break;
            default:
              toolCall = toolCallResult;
              transforming = true;
              break;
          }
        }
        if (transforming) {
          if (toolCall) {
            if (!enqueuedToolCall) {
              enqueuedToolCall = true;
              console.log("enqueueing tool call", toolCall);
              controller.enqueue(toolCall);
            }
            return;
          } else {
            controller.enqueue({ type: "text-delta", delta: chunk, id: nanoid() });
          }
        }
        buffer = newBuffer;
      },
      flush: (controller) => {
        if (!finished) {
          finished = true;
          controller.enqueue({
            type: "finish",
            finishReason: "stop",
            usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
          });
        }
      },
    });
  }
}
