import {
  LanguageModelV1CallOptions,
  LanguageModelV1FunctionToolCall,
  LanguageModelV1StreamPart,
} from "@ai-sdk/provider";
import { nanoid } from "nanoid";

export const objectStartSequence = " ```json\n";
export const objectStopSequence = "\n```";

export type ToolCall = LanguageModelV1FunctionToolCall;

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
  const codeBlockStart = content.match(/^```(?:json|js)?\s*/i);
  const cleanContent = codeBlockStart
    ? content.slice(codeBlockStart[0].length)
    : content;

  // If content is empty after removing markers, we're still undecided
  if (!cleanContent) return undefined;

  // Fail fast if content doesn't start with {
  if (!cleanContent.trim().startsWith("{")) return false;

  // Check if we have a complete JSON object
  try {
    const json = JSON.parse(cleanContent);
    if (typeof json === "object" && json !== null && "toolName" in json) {
      return {
        toolCallType: "function",
        toolCallId: nanoid(),
        toolName: json.toolName,
        args: json.args ? JSON.stringify(json.args) : "",
      };
    }
  } catch {
    // If JSON parsing fails, check if it looks like an incomplete JSON object
    const trimmed = cleanContent.trim();

    // If it doesn't end with }, it might be incomplete
    if (!trimmed.endsWith("}")) return undefined;

    // If it has both { and } but isn't valid JSON, it's malformed
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
  LanguageModelV1StreamPart
> {
  public constructor(options: LanguageModelV1CallOptions) {
    let buffer = "";
    let transforming = false;
    let toolCall: ToolCall | false | undefined = undefined;
    let enqueuedToolCall = false;

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
        const chunk = cleanChunk(_chunk, buffer); // See: https://github.com/jeasonstudio/chrome-ai/issues/11
        let bufferPlusChunk = buffer + chunk;
        if (options.mode.type === "object-json") {
          transforming =
            bufferPlusChunk.startsWith(objectStartSequence) &&
            !bufferPlusChunk.endsWith(objectStopSequence);
          bufferPlusChunk = bufferPlusChunk.replace(
            new RegExp("^" + objectStartSequence, "ig"),
            ""
          );
          bufferPlusChunk = bufferPlusChunk.replace(
            new RegExp(objectStopSequence + "$", "ig"),
            ""
          );
        } else if (toolCall === undefined) {
          const toolCallResult = isToolCall(bufferPlusChunk);
          switch (toolCallResult) {
            case false:
              transforming = true;
              toolCall = false;
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
              controller.enqueue({
                type: "tool-call",
                ...toolCall,
              });
            } else {
              return;
            }
          } else {
            controller.enqueue({ type: "text-delta", textDelta: chunk });
          }
        }
        buffer = bufferPlusChunk;
      },
      flush: (controller) => {
        controller.enqueue({
          type: "finish",
          finishReason: "stop",
          usage: { completionTokens: 0, promptTokens: 0 },
        });
      },
    });
  }
}
