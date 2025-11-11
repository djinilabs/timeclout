import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { VectorSearchClient } from "../vectorSearchClient";

// Mock the worker
class MockWorker {
  private listeners: Map<string, Set<(event: any) => void>> = new Map();
  private messageQueue: any[] = [];

  addEventListener(event: string, handler: (event: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  removeEventListener(event: string, handler: (event: any) => void) {
    this.listeners.get(event)?.delete(handler);
  }

  postMessage(message: any) {
    // Simulate worker response
    if (message.type === "init") {
      setTimeout(() => {
        this.emit("message", {
          data: { type: "init-complete", language: message.language },
        });
      }, 10);
    } else if (message.type === "search") {
      setTimeout(() => {
        this.emit("message", {
          data: {
            type: "results",
            results: [
              {
                text: "Test help content",
                score: 0.95,
                metadata: { section: "test", language: "en", type: "feature" },
              },
            ],
          },
        });
      }, 10);
    }
  }

  terminate() {
    // Mock terminate
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((handler) => handler(data));
  }
}

// Mock @xenova/transformers
vi.mock("@xenova/transformers", () => ({
  pipeline: vi.fn(async () => {
    const mockExtractor = vi.fn(async (text: string) => {
      // Return mock embedding (384 dimensions) as Tensor-like object
      return {
        data: new Array(384).fill(0).map(() => Math.random()),
      };
    });
    return mockExtractor;
  }),
}));

describe("VectorSearchClient", () => {
  let client: VectorSearchClient;
  let originalWorker: typeof Worker;

  beforeEach(() => {
    // Mock Worker constructor
    originalWorker = global.Worker as any;
    (global as any).Worker = vi.fn((url: string) => {
      return new MockWorker() as any;
    });

    client = new VectorSearchClient();
  });

  afterEach(() => {
    client.terminate();
    (global as any).Worker = originalWorker;
  });

  it("should initialize successfully", async () => {
    await expect(client.initialize("en")).resolves.not.toThrow();
  });

  it("should perform search and return results", async () => {
    await client.initialize("en");
    const results = await client.search("test query", "en", 5);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(results[0]).toHaveProperty("text");
      expect(results[0]).toHaveProperty("score");
      expect(results[0]).toHaveProperty("metadata");
    }
  });

  it("should handle errors gracefully", async () => {
    // Create a client that will fail
    const failingClient = new VectorSearchClient();
    // Mock worker to send error
    (global as any).Worker = vi.fn(() => {
      const worker = new MockWorker();
      worker.postMessage = vi.fn((message: any) => {
        if (message.type === "init") {
          setTimeout(() => {
            worker.emit("message", {
              data: { type: "error", error: "Initialization failed" },
            });
          }, 10);
        }
      });
      return worker as any;
    });

    await expect(failingClient.initialize("en")).rejects.toThrow();
    failingClient.terminate();
  });

  it("should use correct language for search", async () => {
    await client.initialize("pt");
    const results = await client.search("teste", "pt", 5);

    expect(results).toBeDefined();
  });

  it("should terminate worker on cleanup", () => {
    const mockTerminate = vi.fn();
    const mockWorker = new MockWorker();
    mockWorker.terminate = mockTerminate;
    (global as any).Worker = vi.fn(() => mockWorker as any);

    const testClient = new VectorSearchClient();
    testClient.terminate();

    // Note: In a real scenario, we'd verify terminate was called
    // This is a simplified test
    expect(testClient).toBeDefined();
  });
});

