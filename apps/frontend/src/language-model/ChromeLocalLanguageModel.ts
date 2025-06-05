import {
  LanguageModelV1,
  LanguageModelV1CallWarning,
  LanguageModelV1FinishReason,
  LanguageModelV1FunctionToolCall,
  LanguageModelV1LogProbs,
  LanguageModelV1ProviderMetadata,
  LanguageModelV1Source,
  LanguageModelV1StreamPart,
} from "@ai-sdk/provider";

export class ChromeLocalLanguageModel implements LanguageModelV1 {
  specificationVersion = "v1" as const;
  provider = "chrome-local" as const;
  modelId = "chrome-local" as const;
  defaultObjectGenerationMode = undefined;
  supportsImageUrls = false;
  supportsStructuredOutputs = false;
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
  doStream(): PromiseLike<{
    stream: ReadableStream<LanguageModelV1StreamPart>;
    rawCall: { rawPrompt: unknown; rawSettings: Record<string, unknown> };
    rawResponse?: { headers?: Record<string, string> };
    request?: { body?: string };
    warnings?: Array<LanguageModelV1CallWarning>;
  }> {
    throw new Error("doStream Method not implemented.");
  }
}
