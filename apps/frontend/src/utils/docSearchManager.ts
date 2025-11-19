import DocSearchWorker from "../workers/docSearchWorker?worker";

export interface SearchResult {
  snippet: string;
  documentName: string;
  documentId: string;
  similarity: number;
}

interface WorkerMessage {
  type: "search" | "index";
  query?: string;
  topN?: number;
  apiUrl: string;
  requestId: string;
}

interface SearchResponse {
  type: "search-response";
  results: SearchResult[];
  requestId: string;
}

interface ErrorResponse {
  type: "error";
  error: string;
  requestId: string;
}

type WorkerResponse = SearchResponse | ErrorResponse;

// Timeout constants
const SEARCH_TIMEOUT_MS = 30000; // 30 seconds
const INDEXING_TIMEOUT_MS = 300000; // 5 minutes

/**
 * Manager for document search web worker
 */
class DocSearchManager {
  private worker: Worker | null = null;
  private pendingRequests = new Map<
    string,
    {
      resolve: (value: SearchResult[]) => void;
      reject: (error: Error) => void;
    }
  >();
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.initWorker();
    // Start pre-indexing in background when manager is created
    // Use setTimeout to ensure worker is fully initialized
    setTimeout(() => {
      this.preIndexDocuments();
    }, 0);
  }

  private initWorker(): void {
    if (this.worker) {
      return;
    }

    this.worker = new DocSearchWorker();

    this.worker.addEventListener(
      "message",
      (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;

        if (response.type === "error") {
          const pending = this.pendingRequests.get(response.requestId);
          if (pending) {
            pending.reject(new Error(response.error));
            this.pendingRequests.delete(response.requestId);
          }
          return;
        }

        if (response.type === "search-response") {
          const pending = this.pendingRequests.get(response.requestId);
          if (pending) {
            pending.resolve(response.results);
            this.pendingRequests.delete(response.requestId);
          }
        }
      }
    );

    this.worker.addEventListener("error", (error) => {
      console.error("[DocSearchManager] Worker error:", error);
      // Reject all pending requests
      for (const [, pending] of this.pendingRequests.entries()) {
        pending.reject(new Error(`Worker error: ${error.message}`));
      }
      this.pendingRequests.clear();
    });
  }

  /**
   * Search documents
   */
  async searchDocuments(
    query: string,
    topN: number = 5
  ): Promise<SearchResult[]> {
    if (!this.worker) {
      throw new Error("Worker not initialized");
    }

    if (!query || query.trim().length === 0) {
      return [];
    }

    const requestId = `${Date.now()}-${Math.random()}`;

    return new Promise<SearchResult[]>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      const message: WorkerMessage = {
        type: "search",
        query: query.trim(),
        topN,
        apiUrl: this.apiUrl,
        requestId,
      };

      this.worker!.postMessage(message);

      // Timeout after configured duration
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error("Search request timed out"));
        }
      }, SEARCH_TIMEOUT_MS);
    });
  }

  /**
   * Trigger indexing (pre-indexing). Indexing also happens automatically on first search.
   * This method can be called to start indexing early in the background.
   * @returns Promise that resolves when indexing is complete
   */
  async indexDocuments(): Promise<void> {
    if (!this.worker) {
      throw new Error("Worker not initialized");
    }

    const requestId = `${Date.now()}-${Math.random()}`;

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error("Indexing request timed out"));
        }
      }, INDEXING_TIMEOUT_MS);

      this.pendingRequests.set(requestId, {
        resolve: () => {
          clearTimeout(timeout);
          resolve();
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });

      const message: WorkerMessage = {
        type: "index",
        apiUrl: this.apiUrl,
        requestId,
      };

      this.worker!.postMessage(message);
    });
  }

  /**
   * Check if the worker is initialized
   * @returns true if worker is initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.worker !== null;
  }

  /**
   * Pre-index documents in the background. This starts indexing immediately
   * so it's ready when the first search arrives. Non-blocking - returns immediately.
   */
  preIndexDocuments(): void {
    if (!this.worker) {
      throw new Error("Worker not initialized");
    }

    // Trigger indexing by sending an index message
    // The worker will handle it in the background
    const requestId = `${Date.now()}-${Math.random()}`;
    const message: WorkerMessage = {
      type: "index",
      apiUrl: this.apiUrl,
      requestId,
    };

    this.worker.postMessage(message);

    // Don't wait for response - let it run in background
    // The promise will be handled but we don't track it
  }

  /**
   * Cleanup worker
   */
  destroy(): void {
    if (this.worker) {
      // Reject all pending requests
      for (const [, pending] of this.pendingRequests.entries()) {
        pending.reject(new Error("Worker destroyed"));
      }
      this.pendingRequests.clear();

      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Singleton instance
let managerInstance: DocSearchManager | null = null;

/**
 * Get or create the document search manager instance
 */
export function getDocSearchManager(apiUrl: string): DocSearchManager {
  if (!managerInstance) {
    managerInstance = new DocSearchManager(apiUrl);
  }
  return managerInstance;
}

/**
 * Search documents using the manager
 */
export async function searchDocuments(
  query: string,
  topN: number = 5,
  apiUrl: string = ""
): Promise<SearchResult[]> {
  const manager = getDocSearchManager(apiUrl);
  return manager.searchDocuments(query, topN);
}
