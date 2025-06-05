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

interface LanguageModelCreateOptions {
  monitor?: (monitor: LanguageModelMonitor) => void;
}

interface LanguageModel {
  availability(): Promise<"available" | "downloadable" | "unavailable">;
  create(options?: LanguageModelCreateOptions): Promise<void>;
}

declare global {
  let LanguageModel: LanguageModel | undefined;
  interface Window {
    LanguageModel: LanguageModel | undefined;
  }
}
