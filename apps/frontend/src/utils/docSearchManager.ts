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
  }

  private initWorker(): void {
    if (this.worker) {
      return;
    }

    this.worker = new DocSearchWorker();

    this.worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
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
    });

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

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error("Search request timed out"));
        }
      }, 30000);
    });
  }

  /**
   * Trigger indexing (optional, indexing happens on first search)
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
      }, 300000); // 5 minutes timeout for indexing

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

