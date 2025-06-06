interface LanguageModelDownloadProgressEvent {
  loaded: number;
  total: number;
}

interface LanguageModelMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (event: LanguageModelDownloadProgressEvent) => void
  ): void;
}

type LanguageModelAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

type LanguageModelMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: Array<{
    type: "text";
    value: string;
  }>;
};

interface LanguageModelCreateOptions {
  monitor?: (monitor: LanguageModelMonitor) => void;
  modelId?: string;
  settings?: {
    temperature?: number;
    topK?: number;
  };
  initialPrompts?: LanguageModelMessage[];
  expectedInputs?: Array<{
    type: "text" | "audio";
    languages: string[];
  }>;
  expectedOutputs?: Array<{
    type: "text";
    languages: string[];
  }>;
}

interface LanguageModelSession {
  promptStreaming(messages: string): ReadableStream<string>;
  prompt(messages: string): Promise<string>;
}

interface LanguageModel {
  availability(
    options?: LanguageModelCreateOptions
  ): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

declare global {
  let LanguageModel: LanguageModel | undefined;
  interface Window {
    LanguageModel: LanguageModel | undefined;
  }
}
