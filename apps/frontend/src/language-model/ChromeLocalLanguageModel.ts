import {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1CallWarning,
  LanguageModelV1FilePart,
  LanguageModelV1FinishReason,
  LanguageModelV1FunctionToolCall,
  LanguageModelV1ImagePart,
  LanguageModelV1LogProbs,
  LanguageModelV1Message,
  LanguageModelV1ProviderMetadata,
  LanguageModelV1ReasoningPart,
  LanguageModelV1RedactedReasoningPart,
  LanguageModelV1Source,
  LanguageModelV1StreamPart,
  LanguageModelV1TextPart,
  LanguageModelV1ToolCallPart,
  LanguageModelV1ToolResultPart,
  UnsupportedFunctionalityError,
} from "@ai-sdk/provider";
import { StreamAI } from "./StreamAI";

export type ChromeAIChatModelId = "text";

export interface ChromeAIAssistantCreateOptions {
  temperature?: number;
  topK?: number;
  initialPrompts?: LanguageModelMessage[];
}

export type ChromeAIChatSettings = ChromeAIAssistantCreateOptions;

export const mapRole = (
  role: LanguageModelV1Message["role"]
): LanguageModelMessage["role"] => {
  if (role === "tool") {
    return "user";
  }
  return role;
};

const mapContent = (
  content:
    | string
    | LanguageModelV1TextPart
    | LanguageModelV1ImagePart
    | LanguageModelV1FilePart
    | LanguageModelV1ReasoningPart
    | LanguageModelV1RedactedReasoningPart
    | LanguageModelV1ToolCallPart
    | LanguageModelV1ToolResultPart
): string => {
  if (typeof content === "string") {
    return content;
  }
  if (content.type !== "text") {
    throw new Error(`Unsupported content type: ${content.type}`);
  }
  return content.text;
};

const mapAllContent = (content: LanguageModelV1Message["content"]): string => {
  if (Array.isArray(content)) {
    return content.map(mapContent).join("\n\n");
  }
  return mapContent(content);
};

const mapMessage = (message: LanguageModelV1Message): string => {
  const content = mapAllContent(message.content);
  return `${message.role}: ${content}`;
};

const mapInitialPrompt = (prompt: LanguageModelMessage): string => {
  return `${prompt.role}: ${prompt.content.map((c) => c.value).join("\n\n")}`;
};

export class ChromeLocalLanguageModel implements LanguageModelV1 {
  specificationVersion = "v1" as const;
  provider = "chrome-local" as const;
  modelId: ChromeAIChatModelId;
  defaultObjectGenerationMode = "json" as const;
  supportsImageUrls = false;
  supportsStructuredOutputs = false;
  options: ChromeAIChatSettings;
  initialPrompts: LanguageModelMessage[];
  session: Promise<LanguageModelSession>;

  constructor(
    modelId: ChromeAIChatModelId,
    { initialPrompts, ...options }: ChromeAIChatSettings = {}
  ) {
    this.modelId = modelId;
    this.options = options;
    const languageModel =
      "LanguageModel" in window
        ? (window.LanguageModel as LanguageModel)
        : undefined;
    if (!languageModel) {
      throw new Error("LanguageModel is not available");
    }
    this.initialPrompts = initialPrompts ?? [];
    this.session = languageModel.create({
      modelId: this.modelId,
      settings: this.options,
      expectedInputs: [
        {
          type: "text",
          languages: ["en"],
        },
      ],
      expectedOutputs: [{ type: "text", languages: ["en"] }],
    });
  }

  supportsUrl() {
    return false;
  }
  doGenerate(): PromiseLike<{
    text?: string;
    reasoning?:
      | string
      | Array<
          | { type: "text"; text: string; signature?: string }
          | { type: "redacted"; data: string }
        >;
    files?: Array<{ data: string | Uint8Array; mimeType: string }>;
    toolCalls?: Array<LanguageModelV1FunctionToolCall>;
    finishReason: LanguageModelV1FinishReason;
    usage: { promptTokens: number; completionTokens: number };
    rawCall: { rawPrompt: unknown; rawSettings: Record<string, unknown> };
    rawResponse?: { headers?: Record<string, string>; body?: unknown };
    request?: { body?: string };
    response?: { id?: string; timestamp?: Date; modelId?: string };
    warnings?: LanguageModelV1CallWarning[];
    providerMetadata?: LanguageModelV1ProviderMetadata;
    sources?: LanguageModelV1Source[];
    logprobs?: LanguageModelV1LogProbs;
  }> {
    throw new Error("doGenerate Method not implemented.");
  }

  async doStream(options: LanguageModelV1CallOptions): Promise<{
    stream: ReadableStream<LanguageModelV1StreamPart>;
    rawCall: { rawPrompt: unknown; rawSettings: Record<string, unknown> };
    rawResponse?: { headers?: Record<string, string> };
    request?: { body?: string };
    warnings?: Array<LanguageModelV1CallWarning>;
  }> {
    if (["regular", "object-json"].indexOf(options.mode.type) < 0) {
      throw new UnsupportedFunctionalityError({
        functionality: `${options.mode.type} mode`,
      });
    }

    const session = await this.session;
    const messages = options.prompt.flatMap(mapMessage);
    const allMessages = [
      ...this.initialPrompts.map(mapInitialPrompt),
      ...messages,
    ];
    const promptStream = session.promptStreaming(allMessages.join("\n\n"));
    const transformStream = new StreamAI(options);
    const stream = promptStream.pipeThrough(transformStream);

    return {
      stream,
      rawCall: { rawPrompt: options.prompt, rawSettings: { ...this.options } },
    };
  }
}
