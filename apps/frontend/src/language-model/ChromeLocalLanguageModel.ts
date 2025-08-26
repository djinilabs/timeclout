import {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2CallWarning,
  LanguageModelV2FilePart,
  LanguageModelV2FinishReason,
  LanguageModelV2Message,
  LanguageModelV2ReasoningPart,
  LanguageModelV2StreamPart,
  LanguageModelV2TextPart,
  LanguageModelV2ToolCallPart,
  LanguageModelV2ToolResultPart,
  LanguageModelV2Content,
  LanguageModelV2Usage,
  SharedV2ProviderMetadata,
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
    | LanguageModelV2TextPart
    | LanguageModelV2FilePart
    | LanguageModelV2ReasoningPart
    | LanguageModelV2ToolCallPart
    | LanguageModelV2ToolResultPart
): string => {
  if (typeof content === "string") {
    return content;
  }
  switch (content.type) {
    case "text":
      return content.text;
    case "tool-call":
      return JSON.stringify(content, null, 2);
    case "tool-result":
      return JSON.stringify(content, null, 2);
    default:
      throw new Error(`Unsupported content type: ${content.type}`);
  }
};

const mapAllContent = (content: LanguageModelV2Message["content"]): string => {
  if (Array.isArray(content)) {
    return content.map(mapContent).join("\n\n");
  }
  return mapContent(content);
};

const mapMessage = (message: LanguageModelV2Message): string => {
  if (!message.content) {
    return "";
  }
  const content = mapAllContent(message.content);
  switch (message.role) {
    case "system":
      return content;
    case "assistant":
      return `you said:\n${content}\n`;
    case "tool":
      return `tool responded:\n${content}\n`;
    case "user":
    default:
      return `user said:\n${content}\n`;
  }
};

const mapInitialPrompt = (prompt: LanguageModelMessage): string => {
  const content = prompt.content.map((c) => c.value).join("\n\n");
  switch (prompt.role) {
    case "system":
      return content;
    case "assistant":
      return `assistant\n${content}\n`;
    case "tool":
      return `tool\n${content}\n`;
    case "user":
    default:
      return `user\n${content}\n`;
  }
};

const formatMessages = (
  options: LanguageModelV2CallOptions,
  initialPrompts: LanguageModelMessage[],
  messages: LanguageModelV2Message[]
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

  if ((options.tools ?? []).length > 0) {
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
    for (const tool of options.tools!) {
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

export class ChromeLocalLanguageModel implements LanguageModelV2 {
  specificationVersion = "v2" as const;
  provider = "chrome-local" as const;
  modelId: ChromeAIChatModelId;
  defaultObjectGenerationMode = "json" as const;
  supportsImageUrls = false;
  supportsStructuredOutputs = false;
  supportedUrls = {} as Record<string, RegExp[]>;
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
  doGenerate(_options: LanguageModelV2CallOptions): PromiseLike<{
    content: Array<LanguageModelV2Content>;
    finishReason: LanguageModelV2FinishReason;
    usage: LanguageModelV2Usage;
    providerMetadata?: SharedV2ProviderMetadata;
    request?: { body?: unknown };
    response?: {
      headers?: Record<string, string>;
      body?: unknown;
    };
    warnings: LanguageModelV2CallWarning[];
  }> {
    throw new Error("doGenerate Method not implemented.");
  }

  async doStream(options: LanguageModelV2CallOptions): Promise<{
    stream: ReadableStream<LanguageModelV2StreamPart>;
    rawCall: { rawPrompt: unknown; rawSettings: Record<string, unknown> };
    rawResponse?: { headers?: Record<string, string> };
    request?: { body?: string };
    warnings?: Array<LanguageModelV2CallWarning>;
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
