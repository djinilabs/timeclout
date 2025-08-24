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
} from "@ai-sdk/provider";

import { StreamAI } from "./StreamAI";

export type ChromeAIChatModelId = "text";

export interface ChromeAIAssistantCreateOptions {
  temperature?: number;
  topK?: number;
  initialPrompts?: LanguageModelMessage[];
}

export type ChromeAIChatSettings = ChromeAIAssistantCreateOptions;

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
  switch (content.type) {
    case "text": {
      return content.text;
    }
    case "tool-call": {
      return JSON.stringify(content, null, 2);
    }
    case "tool-result": {
      return JSON.stringify(content, null, 2);
    }
    default: {
      throw new Error(`Unsupported content type: ${content.type}`);
    }
  }
};

const mapAllContent = (content: LanguageModelV1Message["content"]): string => {
  if (Array.isArray(content)) {
    return content.map(mapContent).join("\n\n");
  }
  return mapContent(content);
};

const mapMessage = (message: LanguageModelV1Message): string => {
  if (!message.content) {
    return "";
  }
  const content = mapAllContent(message.content);
  switch (message.role) {
    case "system": {
      return content;
    }
    case "assistant": {
      return `you said:\n${content}\n`;
    }
    case "tool": {
      return `tool responded:\n${content}\n`;
    }
    case "user":
    default: {
      return `user said:\n${content}\n`;
    }
  }
};

const mapInitialPrompt = (prompt: LanguageModelMessage): string => {
  const content = prompt.content.map((c) => c.value).join("\n\n");
  switch (prompt.role) {
    case "system": {
      return content;
    }
    case "assistant": {
      return `assistant\n${content}\n`;
    }
    case "tool": {
      return `tool\n${content}\n`;
    }
    case "user":
    default: {
      return `user\n${content}\n`;
    }
  }
};

const formatMessages = (
  options: LanguageModelV1CallOptions,
  initialPrompts: LanguageModelMessage[],
  messages: LanguageModelV1Message[]
): string => {
  const additionalSystemPrompts: LanguageModelMessage[] = [];

  if (options.responseFormat?.type === "json") {
    additionalSystemPrompts.push({
      role: "system",
      content: [
        {
          type: "text",
          value: `Throughout our conversation, always start your responses with "{" and end with "}", ensuring the output is a concise JSON object and strictly avoid including any comments, notes, explanations, or examples in your output.\nFor instance, if the JSON schema is {"type":"object","properties":{"someKey":{"type":"string"}},"required":["someKey"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}, your response should immediately begin with "{" and strictly end with "}", following the format: {"someKey": "someValue"}.\nAdhere to this format for all queries moving forward.`,
        },
      ],
    });

    if (options.responseFormat.description) {
      additionalSystemPrompts.push({
        role: "system",
        content: [
          {
            type: "text",
            value: `Your response should be a JSON object that conforms to the following schema: ${options.responseFormat.description}`,
          },
        ],
      });
    }

    if (options.responseFormat.schema) {
      additionalSystemPrompts.push({
        role: "system",
        content: [
          {
            type: "text",
            value: `The JSON schema is\n${JSON.stringify(
              options.responseFormat.schema,
              null,
              2
            )}`,
          },
        ],
      });
    }
  }

  if (
    options.mode.type === "regular" &&
    (options.mode.tools ?? []).length > 0
  ) {
    additionalSystemPrompts.push({
      role: "system",
      content: [
        {
          type: "text",
          value:
            'There are some tools available. You can use them by producing JSON like this: {"toolName": "tool_name", "args": {"tool_input_key": "tool_input_value"}}.\n\nNo comments, just JSON.Available tools:',
        },
      ],
    });
    for (const tool of options.mode.tools!) {
      additionalSystemPrompts.push({
        role: "system",
        content: [
          {
            type: "text",
            value: JSON.stringify(tool, null, 2),
          },
        ],
      });
    }
  }

  return [
    ...initialPrompts.map(mapInitialPrompt),
    ...additionalSystemPrompts.map(mapInitialPrompt),
    ...messages.map(mapMessage),
  ].join("\n\n");
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
      "LanguageModel" in globalThis
        ? (globalThis.LanguageModel as LanguageModel)
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
    const session = await this.session;
    const messages = formatMessages(
      options,
      this.initialPrompts,
      options.prompt
    );
    console.log("messages", messages);
    const promptStream = session.promptStreaming(messages);
    const transformStream = new StreamAI(options);
    const stream = promptStream.pipeThrough(transformStream);

    return {
      stream,
      rawCall: { rawPrompt: options.prompt, rawSettings: { ...this.options } },
    };
  }
}
