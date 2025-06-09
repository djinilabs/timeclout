import {
  LanguageModelV1CallOptions,
  LanguageModelV1FunctionToolCall,
  LanguageModelV1StreamPart,
} from "@ai-sdk/provider";
import { nanoid } from "nanoid";
import { areAllBracesBalanced } from "./areAllBracesBalanced";

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
  const cleanContent = (
    codeBlockStart ? content.slice(codeBlockStart[0].length) : content
  ).trim();

  // If content is empty after removing markers, we're still undecided
  if (!cleanContent) return undefined;

  // Fail fast if content doesn't start with {
  if (!cleanContent.startsWith("{")) {
    console.log(
      "not a tool call because it doesn't start with {",
      cleanContent
    );
    return false;
  }

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
    if (!areAllBracesBalanced(cleanContent)) {
      console.log(
        "not a tool call because it's not a complete JSON object",
        cleanContent
      );
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
  LanguageModelV1StreamPart
> {
  public constructor(options: LanguageModelV1CallOptions) {
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
        if (options.mode.type === "object-json") {
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
          console.log("isToolCall?", toolCallResult);
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
              controller.enqueue({
                type: "tool-call",
                ...toolCall,
              });
              finished = true;
              controller.enqueue({
                type: "finish",
                finishReason: "stop",
                usage: { completionTokens: 0, promptTokens: 0 },
              });
            } else {
              return;
            }
          } else {
            controller.enqueue({ type: "text-delta", textDelta: chunk });
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
            usage: { completionTokens: 0, promptTokens: 0 },
          });
        }
      },
    });
  }
}
