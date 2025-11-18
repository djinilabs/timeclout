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
      // Reject all pending requests with user-friendly error message
      const errorMessage =
        error.message ||
        "An error occurred in the document search worker. Please try again.";
      for (const [, pending] of this.pendingRequests.entries()) {
        pending.reject(
          new Error(
            `Document search service error: ${errorMessage}. Please refresh the page and try again.`
          )
        );
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
      throw new Error(
        "Document search worker is not initialized. Please refresh the page and try again."
      );
    }

    if (!query || query.trim().length === 0) {
      throw new Error("Search query cannot be empty. Please provide a search term.");
    }

    const requestId = `${Date.now()}-${Math.random()}`;

    return new Promise<SearchResult[]>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(
            new Error(
              `Document search timed out after ${SEARCH_TIMEOUT_MS / 1000} seconds. The search is taking longer than expected. Please try again with a more specific query.`
            )
          );
        }
      }, SEARCH_TIMEOUT_MS);

      // Wrap resolve/reject to clear timeout
      this.pendingRequests.set(requestId, {
        resolve: (value) => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      });

      const message: WorkerMessage = {
        type: "search",
        query: query.trim(),
        topN,
        apiUrl: this.apiUrl,
        requestId,
      };

      try {
        this.worker!.postMessage(message);
      } catch (postError) {
        clearTimeout(timeoutId);
        this.pendingRequests.delete(requestId);
        reject(
          new Error(
            `Failed to send search request: ${
              postError instanceof Error ? postError.message : String(postError)
            }`
          )
        );
      }
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

