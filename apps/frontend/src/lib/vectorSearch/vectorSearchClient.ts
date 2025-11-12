import VectorSearchWorker from "../../workers/vectorSearchWorker?worker";

import type {
  SearchResult,
  WorkerRequest,
  WorkerResponse,
  WorkerSearchRequest,
  WorkerSearchResponse,
  WorkerErrorResponse,
} from "./types";

export class VectorSearchClient {
  private worker: Worker | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;
  // Embedding generation is now handled in the worker, not the client

  /**
   * Initialize the vector search client for a specific language
   */
  async initialize(language: "en" | "pt" = "en"): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      if (this.initialized && this.worker) {
        return;
      }

      // Create worker
      this.worker = new VectorSearchWorker();

      // Wait for worker to be ready
      await new Promise<void>((resolve, reject) => {
        if (!this.worker) {
          reject(new Error("Worker creation failed"));
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error("Worker initialization timeout"));
        }, 30000);

        const messageHandler = (event: MessageEvent<WorkerResponse>) => {
          if (event.data.type === "init-complete") {
            clearTimeout(timeout);
            this.worker?.removeEventListener("message", messageHandler);
            this.initialized = true;
            resolve();
          } else if (event.data.type === "error") {
            clearTimeout(timeout);
            this.worker?.removeEventListener("message", messageHandler);
            reject(new Error(event.data.error));
          }
        };

        this.worker.addEventListener("message", messageHandler);
        this.worker.addEventListener("error", (error) => {
          clearTimeout(timeout);
          reject(error);
        });

        // Send init request
        const initRequest: WorkerRequest = {
          type: "init",
          language,
        };
        this.worker.postMessage(initRequest);
      });
    })();

    return this.initPromise;
  }

  // Embedding generation is now handled in the worker
  // These methods are no longer needed in the client

  /**
   * Search for similar help content
   */
  async search(
    query: string,
    language: "en" | "pt" = "en",
    topK: number = 5
  ): Promise<SearchResult[]> {
    // Ensure initialized
    await this.initialize(language);

    if (!this.worker) {
      throw new Error("Worker not initialized");
    }

    // Send query text to worker - embedding generation happens in the worker
    return new Promise<SearchResult[]>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Search timeout"));
      }, 30000);

      const messageHandler = (event: MessageEvent<WorkerResponse>) => {
        if (event.data.type === "results") {
          clearTimeout(timeout);
          this.worker?.removeEventListener("message", messageHandler);
          // Convert array of objects to SearchResult[]
          const results = (event.data as WorkerSearchResponse).results;
          resolve(Array.isArray(results) ? results : []);
        } else if (event.data.type === "error") {
          clearTimeout(timeout);
          this.worker?.removeEventListener("message", messageHandler);
          reject(new Error((event.data as WorkerErrorResponse).error));
        }
      };

      this.worker!.addEventListener("message", messageHandler);

      // Send search request with query text (not embedding)
      const searchRequest: WorkerSearchRequest = {
        type: "search",
        query, // Send query text, not embedding
        language,
        topK,
      };
      this.worker!.postMessage(searchRequest);
    });
  }

  /**
   * Clean up the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.initialized = false;
      this.initPromise = null;
    }
  }
}

// Export singleton instance
let clientInstance: VectorSearchClient | null = null;

export function getVectorSearchClient(): VectorSearchClient {
  if (!clientInstance) {
    clientInstance = new VectorSearchClient();
  }
  return clientInstance;
}
